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
  website?: string;
  category?: string;
  description?: string;
  address?: string;
  domain?: string;
  status?: BrandStatus;
  role?: Role;
  emailVerified?: boolean;
  verificationToken?: string;
  createdAt?: string;
  updatedAt?: string;
  customEmails?: string;
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
  brand?: ObjectId;
  name?: string;
  startDate?: string;
  endDate?: string;
  discountCodes?: string[];
  isSingleCode?: boolean;
  discountPercentage?: string;
  addresses?: CampaignAddress[];
  users?: ObjectId[];
  budget?: number | null;
  campaignType?: string;
  description?: string | null;
  targetAudience?: string | null;
  status: CampaignStatus | string;
  createdAt?: string;
  updatedAt?: string;
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
  name?: string;
  area?: string;
  city?: string;
  radius?: string;
  startAreaLat?: string;
  startAreaLang?: string;
  startDate?: string;
  users?: ObjectId[];
  captainsWithDates?: CaptainDateAssignment[];
  brandId?: string;
  brandName?: string;
  totalWeight?: number;
  collectionDate?: string;
  pickupLocation?: string;
  notes?: string;
  paperWeight?: number;
  cardboardWeight?: number;
  plasticWeight?: number;
  glassWeight?: number;
  aluminumWeight?: number;
  steelWeight?: number;
  electronicWeight?: number;
  organicWeight?: number;
  co2Saved?: number;
  status: CollectionStatus;
  createdAt?: string;
  updatedAt?: string;
  finalizedAt?: string;
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
  email: string;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
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
  brandId?: string;
  title: string;
  description?: string | null;
  discountAmount?: number | null;
  discountPercentage?: number | null;
  promoCode?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  maxUses?: number | null;
  currentUses?: number | null;
  minimumPurchase?: number | null;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}
