import cloudinary, {
  UploadApiErrorResponse,
  UploadApiResponse,
} from 'cloudinary';

export class CloudinaryService {
  private static isConnected = false;

  private static cloudinaryConfig: {
    cloud_name: string;
    api_key: string;
    api_secret: string;
  };

  private constructor() {}

  public static initialize(config: {
    cloud_name: string;
    api_key: string;
    api_secret: string;
  }) {
    if (CloudinaryService.isConnected) {
      return;
    }
    CloudinaryService.cloudinaryConfig = config;
    cloudinary.v2.config({
      cloud_name: config.cloud_name,
      api_key: config.api_key,
      api_secret: config.api_secret,
    });
    CloudinaryService.isConnected = true;
  }

  public static uploads(
    file: string,
    public_id?: string,
    overwrite?: boolean,
    invalidate?: boolean
  ): Promise<UploadApiResponse | UploadApiErrorResponse | undefined> {
    return new Promise((resolve) => {
      cloudinary.v2.uploader.upload(
        file,
        { public_id, overwrite, invalidate, resource_type: 'auto' },
        (error, result) => {
          if (error) resolve(error);
          resolve(result);
        }
      );
    });
  }

  // Video upload method
  public static videoUpload(
    file: string,
    public_id?: string,
    overwrite?: boolean,
    invalidate?: boolean
  ): Promise<UploadApiResponse | UploadApiErrorResponse | undefined> {
    return new Promise((resolve) => {
      cloudinary.v2.uploader.upload(
        file,
        {
          public_id,
          overwrite,
          invalidate,
          resource_type: 'video',
          chunk_size: 50000,
        },
        (error, result) => {
          if (error) resolve(error);
          resolve(result);
        }
      );
    });
  }
}
