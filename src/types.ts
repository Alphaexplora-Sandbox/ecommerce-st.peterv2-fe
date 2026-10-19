export interface Plan {
  id: string;
  name: string;
  category: 'Casket' | 'Cremation';
  casketOrUrnType: string;
  basePrice: number;
  viewingDays: number;
  hasReturnOfPremium: boolean;
  features: string[];
}

export interface Beneficiary {
  id: string;
  fullName: string;
  relationship: string;
  birthDate?: string;
  percentageShare: number;
  isPrimary: boolean;
}

export interface Chapel {
  id: string;
  name: string;
  region: string;
  address: string;
  contactNumber: string;
  totalViewingRooms: number;
  hasCrematorium: boolean;
  hasAircon: boolean;
}

export interface Tribute {
  id: string;
  senderName: string;
  relationship: string;
  message: string;
  createdAt: string;
}

export interface EBurolSessionData {
  id: string;
  deceasedName: string;
  familyContactName: string;
  chapelName: string;
  candleCount: number;
  tributes: Tribute[];
}