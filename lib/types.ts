export interface Candidate {
  id: string;
  name: string;
  gender: 'Male' | 'Female';
  governorate: string;
  party: string;
  nomination_type: string;
  ballot_number: number;
}

export interface PaginatedCandidates {
    data: Candidate[];
    total: number;
    page: number;
    limit: number;
}

export interface Governorate {
  id: number;
  name_en: string;
  name_ar: string;
}

export interface Stats {
    total_candidates: number;
    gender_distribution: {
        Male: number;
        Female: number;
    };
    candidates_per_governorate: {
        governorate_name: string;
        candidate_count: number;
    }[];
}
