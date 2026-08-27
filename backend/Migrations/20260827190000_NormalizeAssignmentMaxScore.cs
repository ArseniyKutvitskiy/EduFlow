using EduFlow.Api;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EduFlow.Api.Migrations
{
    [DbContext(typeof(EduFlowDbContext))]
    [Migration("20260827190000_NormalizeAssignmentMaxScore")]
    public partial class NormalizeAssignmentMaxScore : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("UPDATE \"Assignments\" SET \"MaxScore\" = 10 WHERE \"MaxScore\" <> 10;");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
        }
    }
}
