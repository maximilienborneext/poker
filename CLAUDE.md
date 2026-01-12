# Pointing Poker - Planning Poker pour France TV

Application web de Planning Poker pour estimer les taches JIRA en equipe, avec synchronisation temps reel via WebSocket.

## Stack Technique

| Couche | Technologies |
|--------|-------------|
| Frontend | React + TypeScript + Vite |
| Backend | Node.js + Express + TypeScript |
| Temps reel | Socket.io |
| Base de donnees | PostgreSQL |
| Integration | JIRA REST API v3 + Agile API |

## Structure du projet

```
pointing-poker/
├── client/                     # Frontend React (port 5173)
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Button, Card, Input, Modal, Notification
│   │   │   ├── room/           # VotingArea, PokerCard, ParticipantsList, JiraPanel, ActionBar
│   │   │   └── home/           # CreateRoomForm, JoinRoomForm
│   │   ├── pages/              # HomePage, RoomPage
│   │   ├── context/            # SocketContext, RoomContext
│   │   ├── services/           # api.ts, socket.ts
│   │   └── types/              # TypeScript interfaces
│   └── package.json
│
├── server/                     # Backend Node.js (port 3001)
│   ├── src/
│   │   ├── controllers/        # roomController, voteController, jiraController
│   │   ├── services/           # roomService, voteService, jiraService
│   │   ├── socket/             # handlers.ts
│   │   ├── models/             # Room, Participant, Vote, Session
│   │   ├── routes/             # API routes
│   │   └── config/             # env.ts
│   └── package.json
│
└── docker-compose.yml          # PostgreSQL
```

## Fichiers cles

| Fichier | Description |
|---------|-------------|
| `server/src/socket/handlers.ts` | Tous les handlers WebSocket |
| `server/src/services/jiraService.ts` | Integration JIRA (API calls) |
| `server/src/services/roomService.ts` | Gestion rooms/participants/sessions |
| `client/src/context/RoomContext.tsx` | Etat global de la room |
| `client/src/components/room/JiraPanel.tsx` | Liste tickets + formulaire estimation |
| `client/src/components/room/VotingArea.tsx` | Interface de vote |

## Evenements WebSocket

### Client -> Serveur
| Event | Description |
|-------|-------------|
| `room:join` | Rejoindre une room |
| `vote:submit` | Soumettre un vote |
| `vote:clear` | Annuler son vote |
| `session:reveal` | Reveler les votes |
| `session:reset` | Reinitialiser les votes |
| `session:new` | Nouvelle session/ticket |
| `session:finalize` | Valider estimation + sync JIRA |
| `ticket:needs_rework` | Marquer ticket a retravailler |
| `participant:kick` | Expulser un participant |

### Serveur -> Client
| Event | Description |
|-------|-------------|
| `room:joined` | Confirmation connexion |
| `room:participant_joined` | Nouveau participant |
| `room:participant_left` | Participant deconnecte |
| `room:participant_removed` | Participant expulse |
| `vote:submitted` | Quelqu'un a vote |
| `vote:cleared` | Vote annule |
| `session:votes_revealed` | Votes reveles |
| `session:reset` | Votes reinitialises |
| `session:new` | Nouvelle session |
| `session:finalized` | Estimation validee |
| `jira:sync_result` | Resultat sync JIRA |
| `ticket:marked_rework` | Ticket marque a retravailler |
| `participant:kicked` | Notification expulsion |

## Commandes

```bash
# Demarrer PostgreSQL
docker-compose up -d

# Demarrer le serveur (depuis /server)
npm run dev

# Demarrer le client (depuis /client)
npm run dev

# Build
npm run build
```

## Variables d'environnement (server/.env)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/pointing_poker
JIRA_BASE_URL=https://xxx.atlassian.net
JIRA_EMAIL=xxx@francetv.fr
JIRA_API_TOKEN=xxx
```

## Fonctionnalites JIRA

1. **Recherche tickets**: Tickets sans Story Points dans sprints "Refinement"
2. **Estimation**: Mise a jour Story Points + Time Estimate
3. **Deplacement sprint**: Vers "A planifier" apres estimation
4. **A retravailler**: Prefixe titre + commentaire + deplacement vers "Cadrage"
