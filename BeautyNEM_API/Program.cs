using BeautyNEM_API.Interfaces;
using BeautyNEM_API.Models;
using BeautyNEM_API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using static System.Net.Mime.MediaTypeNames;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

IdentityModelEventSource.ShowPII = true;
// Add services to the container.
builder.Services.AddDbContext<BeautyNEMContext>(options =>
    options.UseSqlServer(configuration.GetConnectionString("BeautyNEMContextConnection")));

// Add Authentication & Authorization
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = configuration["Jwt:Issuer"],
        ValidAudience = configuration["Jwt:Issuer"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"])),
        ClockSkew = TimeSpan.Zero // Thay đổi này nếu cần
    };
});

// Add DI
builder.Services.AddTransient<IJwtService, JwtService>();
builder.Services.AddTransient<IAdminAccountService, AdminAccountService>();
builder.Services.AddTransient<IBeauticianAccountService, BeauticianAccountService>();
builder.Services.AddTransient<IBeautyShopAccountService, BeautyshopAccountService>();
builder.Services.AddTransient<IBeauticianDetailsService, BeauticianDetailsService>();
builder.Services.AddTransient<ICustomerAccountService, CustomerAccountService>();
builder.Services.AddTransient<ISearchingService, SearchingService>();
builder.Services.AddTransient<IScheduleService, ScheduleService>();
builder.Services.AddTransient<IEventBookingService, EventBookingService>();
builder.Services.AddTransient<ICustomerBookingService, CustomerBookingService>();
builder.Services.AddTransient<IRecruitingMakeupModelsService, RecruitingMakeupModelsService>();
builder.Services.AddTransient<IBeautyShopService, BeautyShopService>();
builder.Services.AddTransient<ITokenService, TokenService>();
builder.Services.AddTransient<INotificationBeauticianService, NotificationBeauticianService>();
builder.Services.AddTransient<INotificationCustomerService, NotificationCustomerService>();
builder.Services.AddTransient<IBeautyShopProductService, BeautyshopProductsService>();
builder.Services.AddTransient<IRatingService, RatingService>();
builder.Services.AddTransient<IFavoriteService, FavoriteService>();
builder.Services.AddTransient<IArrangeService, ArrangeService>();
builder.Services.AddHttpContextAccessor();
builder.Services.AddTransient<IMoneyService, MoneySerivce>();
// (Thêm các dịch vụ còn lại ở đây)

builder.Services.AddCors();
builder.Services.AddControllers().AddNewtonsoftJson(options =>
    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
);

// Swagger configuration
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo { Title = "BeautyNEM API", Version = "v1" });

    // Define security scheme
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "bearer"
    });

    // Add security requirement
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "BeautyNEM API v1"));

app.UseHttpsRedirection();
app.UseCors(options => options
    .WithOrigins("https://localhost:44319", "http://localhost:3000")
    .AllowAnyHeader()
    .AllowAnyMethod()
    .AllowCredentials());

app.UseAuthentication();
app.UseAuthorization();

app.UseExceptionHandler(exceptionHandlerApp =>
{
    exceptionHandlerApp.Run(async context =>
    {
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        context.Response.ContentType = Text.Plain;
        var exceptionHandlerPathFeature = context.Features.Get<IExceptionHandlerPathFeature>();
        await context.Response.WriteAsync(exceptionHandlerPathFeature?.Error.Message);
    });
});

app.MapControllers();
app.Run();
