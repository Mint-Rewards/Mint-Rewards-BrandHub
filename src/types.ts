export type ObjectId = string;

export type Role =
  | "ADMIN"
  | "MEMBER"
  | "LOGISTIC"
  | "BUSINESS_DEVELOPMENT"
  | "BD_ADMIN"
  | "CAPTAIN"
  | "BRAND";

export type BrandStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "pending"
  | "approved"
  | "rejected";

export interface Brand {
  id?: string;
  _id?: string;

  // Backend camelCase shape
  companyName?: string;
  brandName?: string;
  email?: string;
  logo?: string;
  themeImage?: string;
  webLink?: string;
  appLink?: string;
  contactName?: string;
  phone?: string;
  registrationNumber?: string;
  themeColor?: string;

  // Existing API snake_case shape used by frontend
  company_name?: string;
  brand_name?: string;
  app_link?: string;
  contact_email?: string;
  contact_phone?: string;
  logo_url?: string;
  theme_color?: string;
  created_at?: string;
  updated_at?: string;
  custom_emails?: string;

  // Shared fields
  category?: string;
  description?: string;
  address?: string;
  website?: string;
  domain?: string;
  status?: BrandStatus;
  role?: Role;
  emailVerified?: boolean;
  verificationToken?: string;
}

export interface BrandDocument extends Brand {
  _id: string;
}

export interface BrandApplication {
  id: string;
  brandName: string;
  companyName: string;
  category: string;
  contactEmail: string;
  submissionDate: string;
  status: "pending" | "approved" | "rejected";
  website: string;
  description?: string;
}

export interface CampaignAddress {
  province: string;
  city: string;
  town: string;
}

export type CampaignStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "pending"
  | "approved"
  | "rejected"
  | "draft";

export interface Campaign {
  id: string;
  _id?: string;

  // Backend camelCase shape
  name?: string;
  startDate?: string;
  endDate?: string;
  discountCodes?: string[];
  isSingleCode?: boolean;
  discountPercentage?: string;
  addresses?: CampaignAddress[];
  users?: ObjectId[];
  brand?: ObjectId;

  // Existing API snake_case shape used by frontend
  brand_id: string;
  budget: number | null;
  campaign_type: string;
  created_at: string;
  description: string | null;
  end_date: string | null;
  start_date: string | null;
  target_audience: string | null;
  title: string;
  updated_at: string;

  // Shared
  status: CampaignStatus | string;
}

export interface CampaignDocument extends Campaign {
  _id: string;
}

export interface Captain {
  name: string;
  phone: string;
  email: string;
  password: string;
  avatar: string;
  nationalId?: string;
  nationalIdImage?: string;
  role: Role;
  deviceToken: string;
  created: Date;
  emailVerified: boolean;
  verificationToken?: string;
}

export interface CaptainDocument extends Captain {
  _id: string;
}

export interface CaptainDateAssignment {
  date: string;
  captain: ObjectId;
}

export type CollectionStatus =
  | "PENDING"
  | "COMPLETED"
  | "transit"
  | "warehouse"
  | "finalized";

export interface Collection {
  id: string;
  _id?: string;

  // Backend campaign collection model shape
  name?: string;
  area?: string;
  city?: string;
  radius?: string;
  startAreaLat?: string;
  startAreaLang?: string;
  startDate?: string;
  users?: ObjectId[];
  captainsWithDates?: CaptainDateAssignment[];

  // Existing frontend collection fields
  brand_id: string;
  brand_name?: string;
  total_weight: number;
  collection_date: string;
  pickup_location?: string;
  notes?: string;

  paper_weight?: number;
  cardboard_weight?: number;
  plastic_weight?: number;
  glass_weight?: number;
  aluminum_weight?: number;
  steel_weight?: number;
  electronic_weight?: number;
  organic_weight?: number;
  co2_saved?: number;

  created_at: string;
  updated_at: string;
  finalized_at?: string;

  status: CollectionStatus;
}

export interface CollectionDocument extends Collection {
  _id: string;
}

export interface DiscountLocation {
  province: string;
  city: string;
  town: string;
}

export interface Discount {
  campaignName?: string;
  campaignId?: ObjectId;
  brand?: ObjectId;
  startDate: string;
  endDate: string;
  locations: DiscountLocation[];
  user?: ObjectId;
  code: string;
  redeemEndTime?: string;
  isDownloaded: boolean;
}

export interface DiscountDocument extends Discount {
  _id: string;
}

export interface LocationCity {
  name: string;
  towns: string[];
}

export interface Location {
  province: string;
  cities: LocationCity[];
}

export interface LocationDocument extends Location {
  _id: string;
}

export interface Logistics {
  name: string;
  phone: string;
  email: string;
  password: string;
  avatar: string;
  role: Role;
  deviceToken: string;
  created: Date;
  emailVerified: boolean;
  verificationToken?: string;
}

export interface LogisticsDocument extends Logistics {
  _id: string;
}

export interface BrandTheme {
  name: string;
  logo: string;
  backgroundColor: string;
  accentColor: string;
  status: string;
}

export interface BrandThemeDocument extends BrandTheme {
  _id: string;
}

export interface QrCodeWeight {
  qrCode: string;
  weight: number;
}

export interface PickupHistoryEntry {
  collectionId: ObjectId;
  collectionName: string;
  date: Date;
  captain: ObjectId;
  qrCodesWithWeights: QrCodeWeight[];
  status: string;
  comment: string;
}

export interface User {
  id?: string;
  _id?: string;

  // Existing frontend minimal shape
  email: string;
  name?: string;
  created_at?: string;
  updated_at?: string;

  // Backend full shape
  userName?: string;
  password?: string;
  avatar?: string;
  address?: string;
  province?: string;
  city?: string;
  town?: string;
  phone?: string;
  mintId?: string;
  role?: Role;
  latitude?: string;
  longitude?: string;
  deviceToken?: string;
  points?: number;
  totalCollections?: string;
  totalWasteCollected?: string;
  referrals?: string[];
  pickupHistory?: PickupHistoryEntry[];
  created?: Date;
  firstTimeLogin?: boolean;
  otpVerification?: string;
  emailVerified?: boolean;
  verificationToken?: string;
}

export interface UserDocument extends User {
  _id: string;
}

export interface Deal {
  id: string;
  _id?: string;
  brand_id: string;
  created_at: string;
  current_uses: number | null;
  description: string | null;
  discount_amount: number | null;
  discount_percentage: number | null;
  end_date: string | null;
  max_uses: number | null;
  minimum_purchase: number | null;
  promo_code: string | null;
  start_date: string | null;
  status: string;
  title: string;
  updated_at: string;
}
