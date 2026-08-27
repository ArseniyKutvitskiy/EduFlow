using EduFlow.Api;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<EduFlowDbContext>(o => o.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddControllers();
builder.Services.AddCors(o => o.AddPolicy("frontend", p => p.WithOrigins(builder.Configuration["Cors:Origin"] ?? "http://localhost:5173").AllowAnyHeader().AllowAnyMethod()));
var jwt = builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("Не задан Jwt:Key. Укажите его в appsettings.Development.json или переменной окружения Jwt__Key.");
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(o => o.TokenValidationParameters = new() { ValidateIssuer = true, ValidateAudience = true, ValidateLifetime = true, ValidateIssuerSigningKey = true, ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "EduFlow", ValidAudience = builder.Configuration["Jwt:Audience"] ?? "EduFlow", IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt)) });
builder.Services.AddAuthorization(); builder.Services.AddOpenApi(); builder.Services.AddSwaggerGen(o => { o.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme { Name = "Authorization", Type = SecuritySchemeType.Http, Scheme = "bearer", BearerFormat = "JWT", In = ParameterLocation.Header, Description = "Введите JWT-токен." }); o.AddSecurityRequirement(_ => new OpenApiSecurityRequirement { [new OpenApiSecuritySchemeReference("Bearer", null)] = [] }); });
var app = builder.Build();
app.UseExceptionHandler(e => e.Run(async c => { c.Response.StatusCode = 500; await c.Response.WriteAsJsonAsync(new { message = "Внутренняя ошибка сервера." }); }));
app.UseStaticFiles();
app.UseCors("frontend"); app.UseAuthentication(); app.UseAuthorization(); if (app.Environment.IsDevelopment()) { app.MapOpenApi(); app.UseSwagger(); app.UseSwaggerUI(); }
app.MapControllers();
using (var scope = app.Services.CreateScope()) { var db = scope.ServiceProvider.GetRequiredService<EduFlowDbContext>(); await db.Database.MigrateAsync(); await SeedData.Initialize(db, builder.Configuration["Seed:ResetUsers"] == "true", builder.Configuration["Seed:AdminPassword"]); }
app.Run();
