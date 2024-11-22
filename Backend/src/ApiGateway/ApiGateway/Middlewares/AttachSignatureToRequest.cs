namespace ApiGateway.Middlewares;

public class AttachSignatureToRequest(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context)
    {
        context.Request.Headers["Api-Gateway"] = "Signed";
        await next(context);
    }
}

//dotnet dev-certs https --trust