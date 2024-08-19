export interface Player {
    [key: string]: any;
    id: string,
    player_id: string,
    picture: string,
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
    uniqueness: number,
    player_rank: number,
    draft_row: number,
    isAbsent: boolean
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
    shots: number,
    season: number,
};

export interface Drafter extends Partial<Team> {
    roster: Player[],
    numD: number,
    numF: number,
    numG: number,
};

export interface Game {
    game_id: string,
    status: string, 
    formatted_date: string,
    time: string,
    home_team: string,
    home_team_logo: string,
    home_team_id: string,
    away_team: string,
    away_team_logo: string,
    away_team_id: string,
    home_score: number,
    home_shots: number,
    away_score: number,
    away_shots: number,
    hasBoxscore: boolean,
};

export interface Card {
    card: string,
    suit: string,
    val: number,
    img: string,
};

export interface Gambler {
    seat: number,
    chips: number,
    bet: number,
    action: string,
    hand: Card[],
    handVal: number,
}