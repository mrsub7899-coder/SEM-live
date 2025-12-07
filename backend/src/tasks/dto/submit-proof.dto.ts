export class SubmitProofDto {
  userId: string;
  proofUrl: string;
  proofType: 'IMAGE' | 'VIDEO';
}