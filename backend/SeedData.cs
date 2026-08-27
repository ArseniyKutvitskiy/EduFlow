namespace EduFlow.Api;

public static class SeedData
{
    public static async Task Initialize(EduFlowDbContext db, bool resetUsers = false, string? adminPassword = null)
    {
        if (resetUsers)
        {
            db.Users.RemoveRange(db.Users);
            await db.SaveChangesAsync();
        }

        if (db.Users.Any())
        {
            return;
        }

        if (string.IsNullOrWhiteSpace(adminPassword))
        {
            throw new InvalidOperationException("Для пустой базы задайте Seed:AdminPassword в appsettings.Development.json или переменной окружения Seed__AdminPassword.");
        }

        db.Users.Add(new User
        {
            FirstName = "Главный",
            LastName = "Администратор",
            Email = "admin1@gmail.com",
            Role = UserRole.Administrator,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(adminPassword)
        });
        await db.SaveChangesAsync();
    }
}
