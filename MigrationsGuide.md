# Entity Framework Core Migrations Guide

To set up the database using the provided model and context, follow these steps in your terminal:

## Prerequisites
Ensure you have the .NET SDK installed (v8.0 recommended) and the EF Core CLI tools.
If you don't have the tools installed, run:
```bash
dotnet tool install --global dotnet-ef
```

## Running Migrations

1. **Navigate to the Backend directory**:
   ```bash
   cd Backend
   ```

2. **Create the initial migration**:
   This command analyzes your `User` model and generates the code to create the `users` table.
   ```bash
   dotnet ef migrations add InitialCreate
   ```

3. **Apply the migration to the database**:
   This command executes the generated code against your SQL Server instance (configured in `appsettings.json`).
   ```bash
   dotnet ef database update
   ```

## Troubleshooting
- If you change the `User.cs` model, run `dotnet ef migrations add <MigrationName>` again.
- Ensure your SQL Server instance is running and the connection string in `appsettings.json` is correct for your environment.
