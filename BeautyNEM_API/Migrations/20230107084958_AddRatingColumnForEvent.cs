using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BeautyNEM_API.Migrations
{
    public partial class AddRatingColumnForEvent : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "RatingId",
                table: "Event",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Event_RatingId",
                table: "Event",
                column: "RatingId");

            migrationBuilder.AddForeignKey(
                name: "FK_Event_Rating_RatingId",
                table: "Event",
                column: "RatingId",
                principalTable: "Rating",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Event_Rating_RatingId",
                table: "Event");

            migrationBuilder.DropIndex(
                name: "IX_Event_RatingId",
                table: "Event");

            migrationBuilder.DropColumn(
                name: "RatingId",
                table: "Event");

            migrationBuilder.AddColumn<int>(
                name: "StarNumber",
                table: "Rating",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
