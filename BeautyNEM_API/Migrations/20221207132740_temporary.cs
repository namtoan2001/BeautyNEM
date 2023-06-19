using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BeautyNEM_API.Migrations
{
    public partial class temporary : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "EventModelRecruit",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Note = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RecruitingMakeupModelsId = table.Column<int>(type: "int", nullable: true),
                    CustomerId = table.Column<int>(type: "int", nullable: true),
                    BeauticianId = table.Column<int>(type: "int", nullable: true),
                    EventStatusId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventModelRecruit", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EventModelRecruit_Beautician_BeauticianId",
                        column: x => x.BeauticianId,
                        principalTable: "Beautician",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_EventModelRecruit_Customer_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Customer",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_EventModelRecruit_EventStatus_EventStatusId",
                        column: x => x.EventStatusId,
                        principalTable: "EventStatus",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_EventModelRecruit_RecruitingMakeupModels_RecruitingMakeupModelsId",
                        column: x => x.RecruitingMakeupModelsId,
                        principalTable: "RecruitingMakeupModels",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_EventModelRecruit_BeauticianId",
                table: "EventModelRecruit",
                column: "BeauticianId");

            migrationBuilder.CreateIndex(
                name: "IX_EventModelRecruit_CustomerId",
                table: "EventModelRecruit",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_EventModelRecruit_EventStatusId",
                table: "EventModelRecruit",
                column: "EventStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_EventModelRecruit_RecruitingMakeupModelsId",
                table: "EventModelRecruit",
                column: "RecruitingMakeupModelsId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EventModelRecruit");
        }
    }
}
