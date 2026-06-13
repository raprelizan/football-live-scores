# Football-Data.org API Integration Plan

## API Overview

**Free Plan Features:**
- 12 competitions (limited)
- Scores delayed (not live)
- 10 calls/minute rate limit
- No line-ups, goal scorers, or detailed stats
- Basic fixtures and league tables only

**Free w/ Livescores (€12/month):**
- Live scores (real-time)
- 20 calls/minute
- Still limited to 12 competitions

**Recommended for this project:** Use Free plan with fallback to mock data

## Available Competitions (Free Tier - 12)

1. Premier League (England)
2. La Liga (Spain)
3. Serie A (Italy)
4. Bundesliga (Germany)
5. Ligue 1 (France)
6. UEFA Champions League
7. UEFA Europa League
8. World Cup
9. European Championship
10. Copa América
11. African Cup of Nations
12. Others (varies)

## API Endpoints

### Main Resources
- `GET /competitions` - List all competitions
- `GET /competitions/{id}` - Get specific competition
- `GET /competitions/{id}/matches` - Get matches for competition
- `GET /matches` - Get today's matches
- `GET /matches/{id}` - Get specific match details
- `GET /competitions/{id}/standings` - Get league standings
- `GET /competitions/{id}/scorers` - Get top scorers

### Rate Limiting
- Free: 10 requests/minute
- Headers: `X-Requests-Available-Minute`, `X-RequestCounter-Reset`

## Implementation Strategy

### 1. Caching Strategy
- Cache competition data for 24 hours
- Cache standings for 6 hours
- Cache match data for 30 seconds (for real-time updates)
- Use database to store cached data

### 2. Fallback Data
- Store mock data in database for when API limit is reached
- Mock data includes:
  - Sample competitions
  - Sample matches with various statuses
  - Sample teams and standings
  - Sample players and goal scorers

### 3. Request Optimization
- Batch requests where possible
- Only fetch data when needed
- Implement smart polling (30-second intervals)
- Use conditional requests with Last-Modified headers

### 4. Error Handling
- Graceful degradation to mock data
- Display "Data may be delayed" message
- Log API errors for monitoring
- Retry failed requests with exponential backoff

## Database Schema

### Tables Needed
1. `competitions` - Store competition metadata
2. `matches` - Store match data
3. `teams` - Store team information
4. `standings` - Store league standings
5. `scorers` - Store top scorers
6. `api_cache` - Store API response cache with timestamps
7. `api_usage` - Track API usage for rate limiting

## Frontend Considerations

- Display "Last updated: X seconds ago" timestamp
- Show loading states during API calls
- Implement 30-second auto-refresh
- Handle offline mode gracefully
- Show cached data indicator when using fallback
