﻿// <auto-generated />
using System;
using BeautyNEM_API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace BeautyNEM_API.Migrations
{
    [DbContext(typeof(BeautyNEMContext))]
    [Migration("20221213124917_AddShop")]
    partial class AddShop
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.10")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder, 1L, 1);

            modelBuilder.Entity("BeautyNEM_API.Models.Administrator", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<string>("Fullname")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Administrator");
                });

            modelBuilder.Entity("BeautyNEM_API.Models.Beautician", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<string>("Avatar")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("BirthDate")
                        .HasColumnType("datetime2");

                    b.Property<int>("CityId")
                        .HasColumnType("int");

                    b.Property<int>("DistrictId")
                        .HasColumnType("int");

                    b.Property<string>("FullName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PhoneNumber")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<double>("StarNumber")
                        .HasColumnType("float");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("CityId");

                    b.HasIndex("DistrictId");

                    b.ToTable("Beautician");
                });

            modelBuilder.Entity("BeautyNEM_API.Models.BeauticianImage", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<int>("BeauticianId")
                        .HasColumnType("int");

                    b.Property<string>("ImageLink")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("BeauticianId");

                    b.ToTable("BeauticianImage");
                });

            modelBuilder.Entity("BeautyNEM_API.Models.City", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("City");
                });

            modelBuilder.Entity("BeautyNEM_API.Models.Customer", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<string>("Address")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("BirthDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("FullName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PhoneNumber")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Customer");
                });

            modelBuilder.Entity("BeautyNEM_API.Models.District", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<int>("CityId")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("CityId");

                    b.ToTable("District");
                });

            modelBuilder.Entity("BeautyNEM_API.Models.Event", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<string>("Address")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("BeauticianId")
                        .HasColumnType("int");

                    b.Property<int?>("CustomerId")
                        .HasColumnType("int");

                    b.Property<DateTime>("DateEvent")
                        .HasColumnType("datetime2");

                    b.Property<TimeSpan>("EndTime")
                        .HasColumnType("time");

                    b.Property<int?>("EventStatusId")
                        .HasColumnType("int");

                    b.Property<string>("Note")
                        .HasColumnType("nvarchar(max)");

                    b.Property<TimeSpan>("StartTime")
                        .HasColumnType("time");

                    b.HasKey("Id");

                    b.HasIndex("BeauticianId");

                    b.HasIndex("CustomerId");

                    b.HasIndex("EventStatusId");

                    b.ToTable("Event");
                });

            modelBuilder.Entity("BeautyNEM_API.Models.EventModelRecruit", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<string>("Address")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("BeauticianId")
                        .HasColumnType("int");

                    b.Property<int?>("CustomerId")
                        .HasColumnType("int");

                    b.Property<int?>("EventStatusId")
                        .HasColumnType("int");

                    b.Property<string>("Note")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("RecruitingMakeupModelsId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("BeauticianId");

                    b.HasIndex("CustomerId");

                    b.HasIndex("EventStatusId");

                    b.HasIndex("RecruitingMakeupModelsId");

                    b.ToTable("EventModelRecruit");
                });

            modelBuilder.Entity("BeautyNEM_API.Models.EventService", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<int>("EventId")
                        .HasColumnType("int");

                    b.Property<int>("ServiceId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("EventId");

                    b.HasIndex("ServiceId");

                    b.ToTable("EventServices");
                });

            modelBuilder.Entity("BeautyNEM_API.Models.EventStatus", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<string>("StatusName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("EventStatus");
                });

            modelBuilder.Entity("BeautyNEM_API.Models.Rating", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<int>("BeauticianId")
                        .HasColumnType("int");

                    b.Property<string>("Comment")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("CustomerId")
                        .HasColumnType("int");

                    b.Property<int>("StarNumber")
                        .HasColumnType("int");

                    b.Property<int>("Starnumber")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("BeauticianId");

                    b.HasIndex("CustomerId");

                    b.ToTable("Rating");
                });

            modelBuilder.Entity("BeautyNEM_API.Models.RecruitingMakeupModels", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<int>("BeauticianId")
                        .HasColumnType("int");

                    b.Property<DateTime?>("Date")
                        .HasColumnType("datetime2");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Price")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("BeauticianId");

                    b.ToTable("RecruitingMakeupModels");
                });

            modelBuilder.Entity("BeautyNEM_API.Models.RecruitingMakeupModelsImage", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<string>("Image")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("RecruitingMakeupModelsId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("RecruitingMakeupModelsId");

                    b.ToTable("RecruitingMakeupModelsImage");
                });

            modelBuilder.Entity("BeautyNEM_API.Models.Schedule", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<int?>("BeauticianId")
                        .HasColumnType("int");

                    b.Property<string>("DaysOfWeek")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<TimeSpan>("EndTime")
                        .HasColumnType("time");

                    b.Property<TimeSpan>("StartTime")
                        .HasColumnType("time");

                    b.HasKey("Id");

                    b.HasIndex("BeauticianId");

                    b.ToTable("Schedule");
                });

            modelBuilder.Entity("BeautyNEM_API.Models.Service", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Service");
                });

            modelBuilder.Entity("BeautyNEM_API.Models.Skill", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<int>("BeauticianId")
                        .HasColumnType("int");

                    b.Property<int>("Price")
                        .HasColumnType("int");

                    b.Property<int>("ServiceId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("BeauticianId");

                    b.HasIndex("ServiceId");

                    b.ToTable("Skill");
                });

            modelBuilder.Entity("BeautyNEM_API.Models.Token", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<int?>("BeauticianId")
                        .HasColumnType("int");

                    b.Property<int?>("CustomerId")
                        .HasColumnType("int");

                    b.Property<string>("TokenDevice")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("BeauticianId");

                    b.HasIndex("CustomerId");

                    b.ToTable("Token");
                });

            modelBuilder.Entity("BeautyNEM_API.Models.Beautician", b =>
                {
                    b.HasOne("BeautyNEM_API.Models.City", "City")
                        .WithMany()
                        .HasForeignKey("CityId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("BeautyNEM_API.Models.District", "District")
                        .WithMany()
                        .HasForeignKey("DistrictId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("City");

                    b.Navigation("District");
                });

            modelBuilder.Entity("BeautyNEM_API.Models.BeauticianImage", b =>
                {
                    b.HasOne("BeautyNEM_API.Models.Beautician", "Beautician")
                        .WithMany()
                        .HasForeignKey("BeauticianId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Beautician");
                });

            modelBuilder.Entity("BeautyNEM_API.Models.District", b =>
                {
                    b.HasOne("BeautyNEM_API.Models.City", "City")
                        .WithMany("Districts")
                        .HasForeignKey("CityId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("City");
                });

            modelBuilder.Entity("BeautyNEM_API.Models.Event", b =>
                {
                    b.HasOne("BeautyNEM_API.Models.Beautician", "Beautician")
                        .WithMany()
                        .HasForeignKey("BeauticianId");

                    b.HasOne("BeautyNEM_API.Models.Customer", "Customer")
                        .WithMany()
                        .HasForeignKey("CustomerId");

                    b.HasOne("BeautyNEM_API.Models.EventStatus", "EventStatus")
                        .WithMany()
                        .HasForeignKey("EventStatusId");

                    b.Navigation("Beautician");

                    b.Navigation("Customer");

                    b.Navigation("EventStatus");
                });

            modelBuilder.Entity("BeautyNEM_API.Models.EventModelRecruit", b =>
                {
                    b.HasOne("BeautyNEM_API.Models.Beautician", "Beautician")
                        .WithMany()
                        .HasForeignKey("BeauticianId");

                    b.HasOne("BeautyNEM_API.Models.Customer", "Customer")
                        .WithMany()
                        .HasForeignKey("CustomerId");

                    b.HasOne("BeautyNEM_API.Models.EventStatus", "EventStatus")
                        .WithMany()
                        .HasForeignKey("EventStatusId");

                    b.HasOne("BeautyNEM_API.Models.RecruitingMakeupModels", "RecruitingMakeupModels")
                        .WithMany()
                        .HasForeignKey("RecruitingMakeupModelsId");

                    b.Navigation("Beautician");

                    b.Navigation("Customer");

                    b.Navigation("EventStatus");

                    b.Navigation("RecruitingMakeupModels");
                });

            modelBuilder.Entity("BeautyNEM_API.Models.EventService", b =>
                {
                    b.HasOne("BeautyNEM_API.Models.Event", "Event")
                        .WithMany("EventServices")
                        .HasForeignKey("EventId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("BeautyNEM_API.Models.Service", "Service")
                        .WithMany()
                        .HasForeignKey("ServiceId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Event");

                    b.Navigation("Service");
                });

            modelBuilder.Entity("BeautyNEM_API.Models.Rating", b =>
                {
                    b.HasOne("BeautyNEM_API.Models.Beautician", "Beautician")
                        .WithMany()
                        .HasForeignKey("BeauticianId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("BeautyNEM_API.Models.Customer", "Customer")
                        .WithMany()
                        .HasForeignKey("CustomerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Beautician");

                    b.Navigation("Customer");
                });

            modelBuilder.Entity("BeautyNEM_API.Models.RecruitingMakeupModels", b =>
                {
                    b.HasOne("BeautyNEM_API.Models.Beautician", "Beautician")
                        .WithMany()
                        .HasForeignKey("BeauticianId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Beautician");
                });

            modelBuilder.Entity("BeautyNEM_API.Models.RecruitingMakeupModelsImage", b =>
                {
                    b.HasOne("BeautyNEM_API.Models.RecruitingMakeupModels", "RecruitingMakeupModels")
                        .WithMany()
                        .HasForeignKey("RecruitingMakeupModelsId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("RecruitingMakeupModels");
                });

            modelBuilder.Entity("BeautyNEM_API.Models.Schedule", b =>
                {
                    b.HasOne("BeautyNEM_API.Models.Beautician", "Beautician")
                        .WithMany()
                        .HasForeignKey("BeauticianId");

                    b.Navigation("Beautician");
                });

            modelBuilder.Entity("BeautyNEM_API.Models.Skill", b =>
                {
                    b.HasOne("BeautyNEM_API.Models.Beautician", "Beautician")
                        .WithMany("Skills")
                        .HasForeignKey("BeauticianId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("BeautyNEM_API.Models.Service", "Service")
                        .WithMany()
                        .HasForeignKey("ServiceId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Beautician");

                    b.Navigation("Service");
                });

            modelBuilder.Entity("BeautyNEM_API.Models.Token", b =>
                {
                    b.HasOne("BeautyNEM_API.Models.Beautician", "Beautician")
                        .WithMany()
                        .HasForeignKey("BeauticianId");

                    b.HasOne("BeautyNEM_API.Models.Customer", "Customer")
                        .WithMany()
                        .HasForeignKey("CustomerId");

                    b.Navigation("Beautician");

                    b.Navigation("Customer");
                });

            modelBuilder.Entity("BeautyNEM_API.Models.Beautician", b =>
                {
                    b.Navigation("Skills");
                });

            modelBuilder.Entity("BeautyNEM_API.Models.City", b =>
                {
                    b.Navigation("Districts");
                });

            modelBuilder.Entity("BeautyNEM_API.Models.Event", b =>
                {
                    b.Navigation("EventServices");
                });
#pragma warning restore 612, 618
        }
    }
}
