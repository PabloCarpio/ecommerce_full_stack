import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class SanitizePipe implements PipeTransform {
  transform(value: unknown): unknown {
    if (typeof value === 'string') {
      return this.sanitize(value);
    }
    if (Array.isArray(value)) {
      return value.map((item) => this.transform(item));
    }
    if (typeof value === 'object' && value !== null) {
      const result: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
        result[key] = this.transform(val);
      }
      return result;
    }
    return value;
  }

  private sanitize(str: string): string {
    return str
      .replace(/<\s*script[^>]*>[\s\S]*?<\s*\/\s*script>/gi, '')
      .replace(/<\s*\/?\s*[a-zA-Z][^>]*>/g, '')
      .replace(/javascript\s*:/gi, '')
      .replace(/\bon\w+\s*=\s*["'][^"']*["']/gi, '')
      .replace(/\bon\w+\s*=\s*[^\s>]*/gi, '');
  }
}