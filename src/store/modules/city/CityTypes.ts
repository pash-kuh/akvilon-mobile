export interface CityItem {
  code: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  id: string;
  local: boolean;
  name: string;
}

export interface CityState {
  list: CityItem[];
  loading: boolean;
  active: string;
}
