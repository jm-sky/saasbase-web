export interface UploaderService {
  upload(modelId: string, file: File): Promise<void>
  delete(modelId: string): Promise<void>
}
