# Backend

The backend application is contained in the `Back/` directory. The `out/` directory is reserved for backend build output and is ignored by Git.

To install dependencies:

```bash
bun install
```

To validate the backend and generate the Prisma client:

```bash
bun run build
```

To run:

```bash
bun run start
```

For development with file watching:

```bash
bun run dev
```

The API runs on port `5000` by default.
