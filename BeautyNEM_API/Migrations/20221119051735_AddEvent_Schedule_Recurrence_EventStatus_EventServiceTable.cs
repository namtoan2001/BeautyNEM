using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BeautyNEM_API.Migrations
{
    public partial class AddEvent_Schedule_Recurrence_EventStatus_EventServiceTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "EventStatus",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StatusName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventStatus", x => x.Id);
                });

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

            migrationBuilder.CreateTable(
                name: "Event",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Note = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CustomerId = table.Column<int>(type: "int", nullable: true),
                    BeauticianId = table.Column<int>(type: "int", nullable: true),
                    EventStatusId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Event", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Event_Beautician_BeauticianId",
                        column: x => x.BeauticianId,
                        principalTable: "Beautician",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Event_Customer_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Customer",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Event_EventStatus_EventStatusId",
                        column: x => x.EventStatusId,
                        principalTable: "EventStatus",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Schedule",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BeauticianId = table.Column<int>(type: "int", nullable: true),
                    RecurrenceId = table.Column<int>(type: "int", nullable: true),
                    DaysOfWeek = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Schedule", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Schedule_Beautician_BeauticianId",
                        column: x => x.BeauticianId,
                        principalTable: "Beautician",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Schedule_Recurrence_RecurrenceId",
                        column: x => x.RecurrenceId,
                        principalTable: "Recurrence",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "EventServices",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EventId = table.Column<int>(type: "int", nullable: false),
                    ServiceId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventServices", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EventServices_Event_EventId",
                        column: x => x.EventId,
                        principalTable: "Event",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EventServices_Service_ServiceId",
                        column: x => x.ServiceId,
                        principalTable: "Service",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Event_BeauticianId",
                table: "Event",
                column: "BeauticianId");

            migrationBuilder.CreateIndex(
                name: "IX_Event_CustomerId",
                table: "Event",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_Event_EventStatusId",
                table: "Event",
                column: "EventStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_EventServices_EventId",
                table: "EventServices",
                column: "EventId");

            migrationBuilder.CreateIndex(
                name: "IX_EventServices_ServiceId",
                table: "EventServices",
                column: "ServiceId");

            migrationBuilder.CreateIndex(
                name: "IX_Schedule_BeauticianId",
                table: "Schedule",
                column: "BeauticianId");

            migrationBuilder.CreateIndex(
                name: "IX_Schedule_RecurrenceId",
                table: "Schedule",
                column: "RecurrenceId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Beautician_City_CityId",
                table: "Beautician");

            migrationBuilder.DropForeignKey(
                name: "FK_Beautician_District_DistrictId",
                table: "Beautician");

            migrationBuilder.DropTable(
                name: "BeauticianImage");

            migrationBuilder.DropTable(
                name: "EventServices");

            migrationBuilder.DropTable(
                name: "Schedule");

            migrationBuilder.DropTable(
                name: "Event");

            migrationBuilder.DropTable(
                name: "Recurrence");

            migrationBuilder.DropTable(
                name: "EventStatus");

            migrationBuilder.DropColumn(
                name: "StarNumber",
                table: "Rating");

            migrationBuilder.RenameColumn(
                name: "Starnumber",
                table: "Rating",
                newName: "StarNumber");

            migrationBuilder.AlterColumn<int>(
                name: "DistrictId",
                table: "Beautician",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "CityId",
                table: "Beautician",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Beautician_City_CityId",
                table: "Beautician",
                column: "CityId",
                principalTable: "City",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Beautician_District_DistrictId",
                table: "Beautician",
                column: "DistrictId",
                principalTable: "District",
                principalColumn: "Id");
        }
    }
}
