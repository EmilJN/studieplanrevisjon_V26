# Studieplanrevisjon V26

Et system for håndtering og revisjon av studieplaner.

---

## Kom i gang

### 1. Klargjør miljøet

1. Kopier `env_example` til `.env` i rotmappen
2. Fyll inn nødvendige miljøvariabler i `.env`.

### 2. Bygg og start med Docker Compose

Kjør følgende kommandoer fra prosjektets rotmappe:

```bash
docker compose build
docker compose up
```

Dette starter frontend,backend og database kontaineren.

---

## Prosjektstruktur

```
studieplanrevisjon_V26/
├── backend/
│   ├── app.py
│   ├── Dockerfile
│   ├── requirements.txt
│   └── ...
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   └── ...
├── docker-compose.yml
└── README.md
```

---

## Nyttige kommandoer

| Handling                 | Kommando                 |
| ------------------------ | ------------------------ |
| Bygg alle tjenester      | `docker compose build`   |
| Start alle tjenester     | `docker compose up`      |
| Stoppe alle tjenester    | `docker compose down`    |
| Sletter database volumet | `docker compose down -v` |
| Se logger                | `docker compose logs -f` |

---
