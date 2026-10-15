export interface SignInResponse {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  productId: string | null;
  productType?: string;
  productGroupId?: string;
  role?: string;
  accessToken: string;
}
