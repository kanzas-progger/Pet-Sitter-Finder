using Microsoft.AspNetCore.Http;

namespace SharedLibrary.Middlewares;

public class ListenToOnlyApiGateway(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context)
    {
        // gRPC request doesn't contain Api-Gateway header
        if (context.Request.ContentType?.StartsWith("application/grpc") == true)
        {
            await next(context);
            return;
        }
        
        // Request must contains Api-Gateway header
        var signedHeader = context.Request.Headers["Api-Gateway"];
        
        //If null service unavailable 
        if (signedHeader.FirstOrDefault() is null)
        {
            context.Response.StatusCode = StatusCodes.Status503ServiceUnavailable;
            await context.Response.WriteAsync("Service is unavailable! The request comes not from API Gateway");
        }
        else
        {
            await next(context);
        }
    }
}