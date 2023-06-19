using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BeautyNEM_API.Migrations
{
    public partial class UpdateScheduleTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Schedule_Recurrence_RecurrenceId",
                table: "Schedule");

            migrationBuilder.DropTable(
                name: "Recurrence");

            migrationBuilder.DropIndex(
                name: "IX_Schedule_RecurrenceId",
                table: "Schedule");

            migrationBuilder.DropColumn(
                name: "RecurrenceId",
                table: "Schedule");

            migrationBuilder.AlterColumn<string>(
                name: "Note",
                table: "Event",
                type: "nvarchar(200)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "RecurrenceId",
                table: "Schedule",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Note",
                table: "Event",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "Recurrence",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Recurrence", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Schedule_RecurrenceId",
                table: "Schedule",
                column: "RecurrenceId");

            migrationBuilder.AddForeignKey(
                name: "FK_Schedule_Recurrence_RecurrenceId",
                table: "Schedule",
                column: "RecurrenceId",
                principalTable: "Recurrence",
                principalColumn: "Id");
        }
    }
}
