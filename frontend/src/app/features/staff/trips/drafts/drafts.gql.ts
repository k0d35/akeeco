export type DraftStatus = 'ACTIVE' | 'SUBMITTED' | 'ARCHIVED';

export interface TripDraftDto {
  id: string;
  shared: boolean;
  status?: DraftStatus;

  version?: number | null;
  createdAt?: string;
  updatedAt: string;

  customerName?: string | null;
  customerPhone?: string | null;
  pickupText?: string | null;
  pickupDate?: string | null;
  pickupTime?: string | null;

  formValue?: any;
}

export const GQL_CREATE_DRAFT = `
mutation CreateDraft($input: TripDraftCreateInput!) {
  createTripDraft(input: $input) { id version updatedAt shared }
}
`;

export const GQL_SAVE_DRAFT = `
mutation SaveDraft($input: TripDraftSaveInput!) {
  saveTripDraft(input: $input) {
    id version updatedAt shared
    customerName customerPhone pickupText pickupDate pickupTime
  }
}
`;

export const GQL_LIST_MINE = `
query Mine($status: DraftStatus!) {
  tripDraftsMine(status: $status) {
    id version updatedAt shared
    customerName customerPhone pickupText pickupDate pickupTime
  }
}
`;

export const GQL_LIST_ALL = `
query All($status: DraftStatus!) {
  tripDraftsAll(status: $status) {
    id version updatedAt shared
    customerName customerPhone pickupText pickupDate pickupTime
  }
}
`;

export const GQL_GET_DRAFT = `
query Get($id: ID!) {
  tripDraft(id: $id) {
    id version updatedAt shared
    customerName customerPhone pickupText pickupDate pickupTime
    formValue
  }
}
`;

export const GQL_DELETE_DRAFT = `
mutation Del($id: ID!) { deleteTripDraft(id: $id) }
`;

export const GQL_SUBMIT_DRAFT = `
mutation Submit($id: ID!) { submitTripDraft(id: $id) }
`;

export const GQL_SEARCH_DRAFTS = `
query Search($status: DraftStatus!, $name: String, $phone: String, $pickup: String) {
  tripDraftSearch(status: $status, name: $name, phone: $phone, pickup: $pickup) {
    id version updatedAt shared
    customerName customerPhone pickupText pickupDate pickupTime
  }
}
`;
