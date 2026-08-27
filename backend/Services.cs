using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
namespace EduFlow.Api;

public interface ITokenService { string Create(User u); }
public class TokenService(IConfiguration config) : ITokenService { public string Create(User u) { var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"] ?? throw new InvalidOperationException("Не задан Jwt:Key"))); var token = new JwtSecurityToken(issuer: config["Jwt:Issuer"], audience: config["Jwt:Audience"], claims: [new(ClaimTypes.NameIdentifier, u.Id.ToString()), new(ClaimTypes.Email, u.Email), new(ClaimTypes.Role, u.Role.ToString())], expires: DateTime.UtcNow.AddHours(8), signingCredentials: new(key, SecurityAlgorithms.HmacSha256)); return new JwtSecurityTokenHandler().WriteToken(token); } }
