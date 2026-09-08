// Application Models and Types
export type Rank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
export type AttributeType = 'FOR' | 'INT' | 'FIN' | 'VIT' | 'CAR' | 'DISC';
export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Nightmare';

export interface Profile {
  id: string;
  username: string;
  display_name: string;
  rank: Rank;
  level: number;
  current_xp: number;
  total_xp: number;
  energy: number;
  max_energy: number;
  title: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Attributes {
  id: string;
  user_id: string;
  for_physical: number;
  int_intellect: number;
  fin_financial: number;
  vit_vitality: number;
  car_career: number;
  disc_discipline: number;
  updated_at: string;
}

export interface Quest {
  id: string;
  user_id: string;
  title: string;
  description: string;
  attribute_type: AttributeType;
  difficulty: Difficulty;
  xp_reward: number;
  gold_reward: number;
  is_daily: boolean;
  is_completed: boolean;
  completed_at?: string;
  due_date: string;
  created_at: string;
  updated_at: string;
}

export interface Badge {
  id: string;
  user_id: string;
  name: string;
  description: string;
  icon_url?: string;
  unlocked_at: string;
  created_at: string;
}

export interface SyncQueueItem {
  id: string;
  user_id: string;
  action: 'create' | 'update' | 'delete';
  table_name: string;
  record_id: string;
  payload: Record<string, any>;
  synced: boolean;
  created_at: string;
  synced_at?: string;
}

export interface PlayerStats {
  profile: Profile;
  attributes: Attributes;
  totalGold: number;
  totalBadges: number;
  streakDays: number;
  lastQuestCompletedAt?: string;
}
