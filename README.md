# ttt-backends

This is a mono-repository containing all backends for the Ultimate TTT frontend.

# First Time Setup:
1. Follow the Supabase Local Development Guide: https://supabase.io/docs/guides/local-development
2. Connect to the database (for example with [DBeaver](https://dbeaver.com/) or [BeeKeeper](https://beekeeperstudio.io/))
3. Execute the script in [database/database.sql](https://github.com/ultimate-ttt/ttt-backends/blob/main/database/database.sql)
4. Install the Azure Function Core Tools: https://github.com/Azure/azure-functions-core-tools
5. In each function directory run:
   ```
   mv src/local.settings.example.json src/local.settings.json
   mv .env.example .env
   ```
6. `yarn`

# Commands
- `yarn api`, starts all functions locally and watches for changes
- `yarn start` ran in a specific function directory, starts an individual function app and watches for changes

  
# Roadmap
- [x] Create functions
- [ ] Integrate with frontend (separate route)
- [ ] Create CI scripts
- [ ] Combine online/offline in frontend
- [ ] Combine backend and frontend repo