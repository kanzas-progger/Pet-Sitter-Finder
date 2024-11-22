using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Auth.Core.Abstractions;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using SharedLibrary.Configurations;

namespace Auth.Infrastructure;

public class JwtProvider : IJwtProvider
{
   private readonly JwtOptions _jwtOptions;

   public JwtProvider(IOptions<JwtOptions> jwtOptions)
   {
      _jwtOptions = jwtOptions.Value;
   }

   public string GenerateJwtToken(Guid userId, List<string> roles)
   {
      List<Claim> claims = new List<Claim>
      {
         new Claim("id-", userId.ToString()),
      };
      
      foreach(string role in roles)
         claims.Add(new Claim(ClaimTypes.Role, role));
      
      var signingCredentials = new SigningCredentials(
         new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.SecretKey)),
         SecurityAlgorithms.HmacSha256
         );

      var jwtToken = new JwtSecurityToken(
         claims: claims,
         signingCredentials: signingCredentials,
         //expires: DateTime.UtcNow.AddHours(_jwtOptions.ExpireHours),
         issuer: _jwtOptions.Issuer,
         audience: _jwtOptions.Audience
      );
      
      string stringJwtToken = new JwtSecurityTokenHandler().WriteToken(jwtToken);
      
      return stringJwtToken;
   }
}