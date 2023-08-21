export interface Player {
    [key: string]: any;
    id: string,
    player_id: string,
    img: string,
    name: string,
    position: string,
    year_joined: number,
    games_played: number,
    goals: number,
    assists: number,
    points: number,
    ppg: number,
    pims: number,
    gwg: number,
    season: number,
    team: string,
    logo: string,
};

export interface Team {
    [key: string]: any; 
    id: string,
    name: string,
    captain: string,
    logo: string,
    roster: Player[],
    games_played: number,
    wins: number,
    losses: number,
    ties: number,
    points: number,
    goals_for: number,
    goals_against: number,
    differential: number,
    season: number,
};

export interface Game { 
    formatted_date: string,
    time: string,
    home_team: string,
    home_team_logo: string,
    home_team_id: string,
    away_team: string,
    away_team_logo: string,
    away_team_id: string,
    home_score: number,
    away_score: number,
};