using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EduFlow.Api.Migrations
{
    /// <inheritdoc />
    public partial class RenameDefaultAdminLogin : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                UPDATE "Users"
                SET "Email" = 'admin1@gmail.com'
                WHERE "Email" = 'admin@eduflow.local' AND "Role" = 0;
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                UPDATE "Users"
                SET "Email" = 'admin@eduflow.local'
                WHERE "Email" = 'admin1@gmail.com' AND "Role" = 0;
                """);
        }
    }
}
