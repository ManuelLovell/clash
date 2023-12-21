export interface IOpen5eMonsterListResponse {
    count: number;
    next?: null;
    previous?: null;
    results: Open5eMonsterResponse[];
}

export interface IOpen5eMonsterResponse {
    slug: string;
    name: string;
    size: string;
    type: string;
    environments: string[];
    subtype: string;
    group: string;
    alignment: string;
    armor_class: number;
    armor_desc: string;
    hit_points: number;
    hit_dice: string;
    speed: Speed;
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
    strength_save: number;
    dexterity_save: number;
    constitution_save: number;
    intelligence_save: number;
    wisdom_save: number;
    charisma_save: number;
    perception: number;
    skills: Skills;
    damage_vulnerabilities: string;
    damage_resistances: string;
    damage_immunities: string;
    condition_immunities: string;
    senses: string;
    languages: string;
    challenge_rating: string;
    cr: number;
    actions: ActionsEntity[];
    reactions: ActionsEntity[];
    legendary_desc: string;
    legendary_actions: ActionsEntity[];
    special_abilities: ActionsEntity[];
    spell_list?: string[];
    page_no: number;
    document__slug: string;
    document__title: string;
    document__license_url: string;
  }

  export interface ISpeed
  {
    swim: number;
    burrow: number;
    walk: number;
    fly: number;
    climb: number;
  }

  export interface ISkills 
  {
    athletics: number;
    perception: number;
    stealth: number;
  }

  export interface IActionsEntity 
  {
    name?: string;
    desc?: string;
    attack_bonus?: number;
    damage_dice?: string;
    damage_bonus?: number;
  }

  export interface IOpen5eSpellResponse {
    slug: string;
    name: string;
    desc: string;
    higher_level: string;
    page: string;
    range: string;
    components: string;
    material: string;
    ritual: string;
    duration: string;
    concentration: string;
    casting_time: string;
    level: string;
    level_int: number;
    school: string;
    dnd_class: string;
    archetype: string;
    circles: string;
    document__slug: string;
    document__title: string;
    document__license_url: string;
  }
  