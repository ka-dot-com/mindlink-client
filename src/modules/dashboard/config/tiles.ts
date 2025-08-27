export interface DashboardTile {
  id: string;
  labelKey: string;
  icon: string;
  route?: string;
  enabledByDefault: boolean;
  future?: boolean;
}

export const DEFAULT_TILES: DashboardTile[] = [
  { id: 'goals', labelKey: 'tile_goals', icon: 'flag-outline', route: 'Goals', enabledByDefault: true },
  { id: 'cycle', labelKey: 'tile_cycle', icon: 'calendar-outline', enabledByDefault: true, future: true },
  { id: 'fridge', labelKey: 'tile_fridge', icon: 'cube-outline', enabledByDefault: true, future: true },
  { id: 'recipes', labelKey: 'tile_recipes', icon: 'restaurant-outline', enabledByDefault: true, future: true },
  { id: 'activity', labelKey: 'tile_activity', icon: 'walk-outline', enabledByDefault: true, future: true },
  { id: 'sleep', labelKey: 'tile_sleep', icon: 'moon-outline', enabledByDefault: true, future: true },
  { id: 'supplements', labelKey: 'tile_supplements', icon: 'medkit-outline', enabledByDefault: true, future: true },
  { id: 'hydration', labelKey: 'tile_hydration', icon: 'water-outline', enabledByDefault: true, future: true },
  { id: 'mind_stress', labelKey: 'tile_mind_stress', icon: 'fitness-outline', enabledByDefault: true, future: true },
  { id: 'habits', labelKey: 'tile_habits', icon: 'checkbox-outline', route: 'Habits', enabledByDefault: true },
  { id: 'history', labelKey: 'tile_history', icon: 'time-outline', route: 'History', enabledByDefault: true },
  { id: 'scan', labelKey: 'tile_scan', icon: 'camera-outline', route: 'Scan', enabledByDefault: true },
  { id: 'profile', labelKey: 'tile_profile', icon: 'person-outline', route: 'Profile', enabledByDefault: true },
  { id: 'shopping', labelKey: 'tile_shopping', icon: 'cart-outline', enabledByDefault: true, future: true },
  { id: 'wellness', labelKey: 'tile_wellness', icon: 'pulse-outline', enabledByDefault: true, future: true }
];