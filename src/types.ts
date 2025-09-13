export interface YearlyData {
  year: number;
  population?: number;
  co2?: number;
  co2_per_capita?: number;
  methane?: number;
  oil_co2?: number;
  temperature_change_from_co2?: number;
  cement_co2?: number;
  cumulative_cement_co2?: number;
  cement_co2_per_capita?: number;
  cumulative_luc_co2?: number;
  ghg_excluding_lucf_per_capita?: number;
  ghg_per_capita?: number;
  land_use_change_co2?: number;
  land_use_change_co2_per_capita?: number;
  methane_per_capita?: number;
  nitrous_oxide?: number;
  nitrous_oxide_per_capita?: number;
  share_global_cumulative_luc_co2?: number;
  share_global_luc_co2?: number;
  share_of_temperature_change_from_ghg?: number;
  temperature_change_from_ch4?: number;
  temperature_change_from_ghg?: number;
  temperature_change_from_n2o?: number;
  total_ghg?: number;
  total_ghg_excluding_lucf?: number;
}

export interface CountryInfo {
  iso_code: string;
  data: YearlyData[];
}

export interface CountryData {
  [countryName: string]: CountryInfo;
}
