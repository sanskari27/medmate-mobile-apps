import { ApiError } from '../../../services/api/problem';
import { parseSession } from '../../../services/storage/parse-session';
import { isRecord } from '../../../utils/record';
import { isOtpMode, type OtpMode } from '../types/auth';

export { parseSession };

export function parseOtpMode(value: unknown): OtpMode {
  const record = isRecord(value) ? value : {};
  if (isOtpMode(record.mode)) return record.mode;
  throw new ApiError(500, 'Unexpected response', 'Code could not be sent');
}
