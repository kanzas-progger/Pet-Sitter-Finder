// <auto-generated>
//     Generated by the protocol buffer compiler.  DO NOT EDIT!
//     source: sitter.proto
// </auto-generated>
#pragma warning disable 0414, 1591, 8981, 0612
#region Designer generated code

using grpc = global::Grpc.Core;

namespace UserProfiles.Infrastructure.Protos {
  public static partial class SittersProtoService
  {
    static readonly string __ServiceName = "sitter.SittersProtoService";

    [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
    static void __Helper_SerializeMessage(global::Google.Protobuf.IMessage message, grpc::SerializationContext context)
    {
      #if !GRPC_DISABLE_PROTOBUF_BUFFER_SERIALIZATION
      if (message is global::Google.Protobuf.IBufferMessage)
      {
        context.SetPayloadLength(message.CalculateSize());
        global::Google.Protobuf.MessageExtensions.WriteTo(message, context.GetBufferWriter());
        context.Complete();
        return;
      }
      #endif
      context.Complete(global::Google.Protobuf.MessageExtensions.ToByteArray(message));
    }

    [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
    static class __Helper_MessageCache<T>
    {
      public static readonly bool IsBufferMessage = global::System.Reflection.IntrospectionExtensions.GetTypeInfo(typeof(global::Google.Protobuf.IBufferMessage)).IsAssignableFrom(typeof(T));
    }

    [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
    static T __Helper_DeserializeMessage<T>(grpc::DeserializationContext context, global::Google.Protobuf.MessageParser<T> parser) where T : global::Google.Protobuf.IMessage<T>
    {
      #if !GRPC_DISABLE_PROTOBUF_BUFFER_SERIALIZATION
      if (__Helper_MessageCache<T>.IsBufferMessage)
      {
        return parser.ParseFrom(context.PayloadAsReadOnlySequence());
      }
      #endif
      return parser.ParseFrom(context.PayloadAsNewBuffer());
    }

    [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
    static readonly grpc::Marshaller<global::UserProfiles.Infrastructure.Protos.SittersRequest> __Marshaller_sitter_SittersRequest = grpc::Marshallers.Create(__Helper_SerializeMessage, context => __Helper_DeserializeMessage(context, global::UserProfiles.Infrastructure.Protos.SittersRequest.Parser));
    [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
    static readonly grpc::Marshaller<global::UserProfiles.Infrastructure.Protos.SittersResponse> __Marshaller_sitter_SittersResponse = grpc::Marshallers.Create(__Helper_SerializeMessage, context => __Helper_DeserializeMessage(context, global::UserProfiles.Infrastructure.Protos.SittersResponse.Parser));

    [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
    static readonly grpc::Method<global::UserProfiles.Infrastructure.Protos.SittersRequest, global::UserProfiles.Infrastructure.Protos.SittersResponse> __Method_GetSitters = new grpc::Method<global::UserProfiles.Infrastructure.Protos.SittersRequest, global::UserProfiles.Infrastructure.Protos.SittersResponse>(
        grpc::MethodType.Unary,
        __ServiceName,
        "GetSitters",
        __Marshaller_sitter_SittersRequest,
        __Marshaller_sitter_SittersResponse);

    /// <summary>Service descriptor</summary>
    public static global::Google.Protobuf.Reflection.ServiceDescriptor Descriptor
    {
      get { return global::UserProfiles.Infrastructure.Protos.SitterReflection.Descriptor.Services[0]; }
    }

    /// <summary>Base class for server-side implementations of SittersProtoService</summary>
    [grpc::BindServiceMethod(typeof(SittersProtoService), "BindService")]
    public abstract partial class SittersProtoServiceBase
    {
      [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
      public virtual global::System.Threading.Tasks.Task<global::UserProfiles.Infrastructure.Protos.SittersResponse> GetSitters(global::UserProfiles.Infrastructure.Protos.SittersRequest request, grpc::ServerCallContext context)
      {
        throw new grpc::RpcException(new grpc::Status(grpc::StatusCode.Unimplemented, ""));
      }

    }

    /// <summary>Creates service definition that can be registered with a server</summary>
    /// <param name="serviceImpl">An object implementing the server-side handling logic.</param>
    [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
    public static grpc::ServerServiceDefinition BindService(SittersProtoServiceBase serviceImpl)
    {
      return grpc::ServerServiceDefinition.CreateBuilder()
          .AddMethod(__Method_GetSitters, serviceImpl.GetSitters).Build();
    }

    /// <summary>Register service method with a service binder with or without implementation. Useful when customizing the service binding logic.
    /// Note: this method is part of an experimental API that can change or be removed without any prior notice.</summary>
    /// <param name="serviceBinder">Service methods will be bound by calling <c>AddMethod</c> on this object.</param>
    /// <param name="serviceImpl">An object implementing the server-side handling logic.</param>
    [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
    public static void BindService(grpc::ServiceBinderBase serviceBinder, SittersProtoServiceBase serviceImpl)
    {
      serviceBinder.AddMethod(__Method_GetSitters, serviceImpl == null ? null : new grpc::UnaryServerMethod<global::UserProfiles.Infrastructure.Protos.SittersRequest, global::UserProfiles.Infrastructure.Protos.SittersResponse>(serviceImpl.GetSitters));
    }

  }
}
#endregion
