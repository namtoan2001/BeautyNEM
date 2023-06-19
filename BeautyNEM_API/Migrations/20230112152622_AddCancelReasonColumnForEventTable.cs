using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BeautyNEM_API.Migrations
{
    public partial class AddCancelReasonColumnForEventTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CancelReason",
                table: "Event",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CancelReason",
                table: "Event");
        }
    }
}
