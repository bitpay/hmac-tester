import { IBitPayWebhookValidationResult } from '../../interfaces';

export interface IBitPayWebhookValidationResponse {
  event: string;
  token: string;
  body: string;
  validation?: IBitPayWebhookValidationResult | undefined;
}
