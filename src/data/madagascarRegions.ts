
export interface Region {
  name: string;
  latitude: number;
  longitude: number;
  code: string;
}

export const madagascarRegions: Region[] = [
  {
    name: "Antananarivo",
    latitude: -18.8792,
    longitude: 47.5079,
    code: "TNR"
  },
  {
    name: "Fianarantsoa",
    latitude: -21.4532,
    longitude: 47.0857,
    code: "FIA"
  },
  {
    name: "Toamasina",
    latitude: -18.1239,
    longitude: 49.4035,
    code: "TMM"
  },
  {
    name: "Mahajanga",
    latitude: -15.7167,
    longitude: 46.3167,
    code: "MJN"
  },
  {
    name: "Toliara",
    latitude: -23.3540,
    longitude: 43.6673,
    code: "TLE"
  },
  {
    name: "Antsiranana",
    latitude: -12.2787,
    longitude: 49.2917,
    code: "DIE"
  },
  {
    name: "Morondava",
    latitude: -20.2833,
    longitude: 44.2833,
    code: "MOQ"
  },
  {
    name: "Fort Dauphin",
    latitude: -25.0319,
    longitude: 46.9919,
    code: "FTU"
  },
  {
    name: "Sambava",
    latitude: -14.2667,
    longitude: 50.1667,
    code: "SVB"
  },
  {
    name: "Manakara",
    latitude: -22.1333,
    longitude: 48.0167,
    code: "WMR"
  },
  {
    name: "Antsohihy",
    latitude: -14.8833,
    longitude: 47.9833,
    code: "WAI"
  },
  {
    name: "Maintirano",
    latitude: -18.0500,
    longitude: 44.0333,
    code: "WTA"
  }
];

export const getRegionByCode = (code: string): Region | undefined => {
  return madagascarRegions.find(region => region.code === code);
};
