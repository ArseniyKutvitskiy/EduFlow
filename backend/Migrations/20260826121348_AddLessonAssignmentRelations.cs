using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EduFlow.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddLessonAssignmentRelations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AttachmentName",
                table: "Assignments",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AttachmentUrl",
                table: "Assignments",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ModuleId",
                table: "Assignments",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Assignments_ModuleId",
                table: "Assignments",
                column: "ModuleId");

            migrationBuilder.AddForeignKey(
                name: "FK_Assignments_Modules_ModuleId",
                table: "Assignments",
                column: "ModuleId",
                principalTable: "Modules",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Assignments_Modules_ModuleId",
                table: "Assignments");

            migrationBuilder.DropIndex(
                name: "IX_Assignments_ModuleId",
                table: "Assignments");

            migrationBuilder.DropColumn(
                name: "AttachmentName",
                table: "Assignments");

            migrationBuilder.DropColumn(
                name: "AttachmentUrl",
                table: "Assignments");

            migrationBuilder.DropColumn(
                name: "ModuleId",
                table: "Assignments");
        }
    }
}
