// package: types
// file: rpc.proto

var rpc_pb = require("./rpc_pb");
var blockchain_pb = require("./blockchain_pb");
var account_pb = require("./account_pb");
var metric_pb = require("./metric_pb");
var raft_pb = require("./raft_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var MeyCoinRPCService = (function () {
  function MeyCoinRPCService() {}
  MeyCoinRPCService.serviceName = "types.MeyCoinRPCService";
  return MeyCoinRPCService;
}());

MeyCoinRPCService.NodeState = {
  methodName: "NodeState",
  service: MeyCoinRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.NodeReq,
  responseType: rpc_pb.SingleBytes
};

MeyCoinRPCService.Metric = {
  methodName: "Metric",
  service: MeyCoinRPCService,
  requestStream: false,
  responseStream: false,
  requestType: metric_pb.MetricsRequest,
  responseType: metric_pb.Metrics
};

MeyCoinRPCService.Blockchain = {
  methodName: "Blockchain",
  service: MeyCoinRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.Empty,
  responseType: rpc_pb.BlockchainStatus
};

MeyCoinRPCService.GetChainInfo = {
  methodName: "GetChainInfo",
  service: MeyCoinRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.Empty,
  responseType: rpc_pb.ChainInfo
};

MeyCoinRPCService.ChainStat = {
  methodName: "ChainStat",
  service: MeyCoinRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.Empty,
  responseType: rpc_pb.ChainStats
};

MeyCoinRPCService.ListBlockHeaders = {
  methodName: "ListBlockHeaders",
  service: MeyCoinRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.ListParams,
  responseType: rpc_pb.BlockHeaderList
};

MeyCoinRPCService.ListBlockMetadata = {
  methodName: "ListBlockMetadata",
  service: MeyCoinRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.ListParams,
  responseType: rpc_pb.BlockMetadataList
};

MeyCoinRPCService.ListBlockStream = {
  methodName: "ListBlockStream",
  service: MeyCoinRPCService,
  requestStream: false,
  responseStream: true,
  requestType: rpc_pb.Empty,
  responseType: blockchain_pb.Block
};

MeyCoinRPCService.ListBlockMetadataStream = {
  methodName: "ListBlockMetadataStream",
  service: MeyCoinRPCService,
  requestStream: false,
  responseStream: true,
  requestType: rpc_pb.Empty,
  responseType: rpc_pb.BlockMetadata
};

MeyCoinRPCService.GetBlock = {
  methodName: "GetBlock",
  service: MeyCoinRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.SingleBytes,
  responseType: blockchain_pb.Block
};

MeyCoinRPCService.GetBlockMetadata = {
  methodName: "GetBlockMetadata",
  service: MeyCoinRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.SingleBytes,
  responseType: rpc_pb.BlockMetadata
};

MeyCoinRPCService.GetBlockBody = {
  methodName: "GetBlockBody",
  service: MeyCoinRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.BlockBodyParams,
  responseType: rpc_pb.BlockBodyPaged
};

MeyCoinRPCService.GetTX = {
  methodName: "GetTX",
  service: MeyCoinRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.SingleBytes,
  responseType: blockchain_pb.Tx
};

MeyCoinRPCService.GetBlockTX = {
  methodName: "GetBlockTX",
  service: MeyCoinRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.SingleBytes,
  responseType: blockchain_pb.TxInBlock
};

MeyCoinRPCService.GetReceipt = {
  methodName: "GetReceipt",
  service: MeyCoinRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.SingleBytes,
  responseType: blockchain_pb.Receipt
};

MeyCoinRPCService.GetABI = {
  methodName: "GetABI",
  service: MeyCoinRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.SingleBytes,
  responseType: blockchain_pb.ABI
};

MeyCoinRPCService.SendTX = {
  methodName: "SendTX",
  service: MeyCoinRPCService,
  requestStream: false,
  responseStream: false,
  requestType: blockchain_pb.Tx,
  responseType: rpc_pb.CommitResult
};

MeyCoinRPCService.SignTX = {
  methodName: "SignTX",
  service: MeyCoinRPCService,
  requestStream: false,
  responseStream: false,
  requestType: blockchain_pb.Tx,
  responseType: blockchain_pb.Tx
};

MeyCoinRPCService.VerifyTX = {
  methodName: "VerifyTX",
  service: MeyCoinRPCService,
  requestStream: false,
  responseStream: false,
  requestType: blockchain_pb.Tx,
  responseType: rpc_pb.VerifyResult
};

MeyCoinRPCService.CommitTX = {
  methodName: "CommitTX",
  service: MeyCoinRPCService,
  requestStream: false,
  responseStream: false,
  requestType: blockchain_pb.TxList,
  responseType: rpc_pb.CommitResultList
};

MeyCoinRPCService.GetState = {
  methodName: "GetState",
  service: MeyCoinRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.SingleBytes,
  responseType: blockchain_pb.State
};

MeyCoinRPCService.GetStateAndProof = {
  methodName: "GetStateAndProof",
  service: MeyCoinRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.AccountAndRoot,
  responseType: blockchain_pb.AccountProof
};

MeyCoinRPCService.CreateAccount = {
  methodName: "CreateAccount",
  service: MeyCoinRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.Personal,
  responseType: account_pb.Account
};

MeyCoinRPCService.GetAccounts = {
  methodName: "GetAccounts",
  service: MeyCoinRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.Empty,
  responseType: account_pb.AccountList
};

MeyCoinRPCService.LockAccount = {
  methodName: "LockAccount",
  service: MeyCoinRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.Personal,
  responseType: account_pb.Account
};

MeyCoinRPCService.UnlockAccount = {
  methodName: "UnlockAccount",
  service: MeyCoinRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.Personal,
  responseType: account_pb.Account
};

MeyCoinRPCService.ImportAccount = {
  methodName: "ImportAccount",
  service: MeyCoinRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.ImportFormat,
  responseType: account_pb.Account
};

MeyCoinRPCService.ExportAccount = {
  methodName: "ExportAccount",
  service: MeyCoinRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.Personal,
  responseType: rpc_pb.SingleBytes
};

MeyCoinRPCService.QueryContract = {
  methodName: "QueryContract",
  service: MeyCoinRPCService,
  requestStream: false,
  responseStream: false,
  requestType: blockchain_pb.Query,
  responseType: rpc_pb.SingleBytes
};

MeyCoinRPCService.QueryContractState = {
  methodName: "QueryContractState",
  service: MeyCoinRPCService,
  requestStream: false,
  responseStream: false,
  requestType: blockchain_pb.StateQuery,
  responseType: blockchain_pb.StateQueryProof
};

MeyCoinRPCService.GetPeers = {
  methodName: "GetPeers",
  service: MeyCoinRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.PeersParams,
  responseType: rpc_pb.PeerList
};

MeyCoinRPCService.GetVotes = {
  methodName: "GetVotes",
  service: MeyCoinRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.VoteParams,
  responseType: rpc_pb.VoteList
};

MeyCoinRPCService.GetAccountVotes = {
  methodName: "GetAccountVotes",
  service: MeyCoinRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.AccountAddress,
  responseType: rpc_pb.AccountVoteInfo
};

MeyCoinRPCService.GetStaking = {
  methodName: "GetStaking",
  service: MeyCoinRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.AccountAddress,
  responseType: rpc_pb.Staking
};

MeyCoinRPCService.GetNameInfo = {
  methodName: "GetNameInfo",
  service: MeyCoinRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.Name,
  responseType: rpc_pb.NameInfo
};

MeyCoinRPCService.ListEventStream = {
  methodName: "ListEventStream",
  service: MeyCoinRPCService,
  requestStream: false,
  responseStream: true,
  requestType: blockchain_pb.FilterInfo,
  responseType: blockchain_pb.Event
};

MeyCoinRPCService.ListEvents = {
  methodName: "ListEvents",
  service: MeyCoinRPCService,
  requestStream: false,
  responseStream: false,
  requestType: blockchain_pb.FilterInfo,
  responseType: rpc_pb.EventList
};

MeyCoinRPCService.GetServerInfo = {
  methodName: "GetServerInfo",
  service: MeyCoinRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.KeyParams,
  responseType: rpc_pb.ServerInfo
};

MeyCoinRPCService.GetConsensusInfo = {
  methodName: "GetConsensusInfo",
  service: MeyCoinRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.Empty,
  responseType: rpc_pb.ConsensusInfo
};

MeyCoinRPCService.ChangeMembership = {
  methodName: "ChangeMembership",
  service: MeyCoinRPCService,
  requestStream: false,
  responseStream: false,
  requestType: raft_pb.MembershipChange,
  responseType: raft_pb.MembershipChangeReply
};

MeyCoinRPCService.GetEnterpriseConfig = {
  methodName: "GetEnterpriseConfig",
  service: MeyCoinRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.EnterpriseConfigKey,
  responseType: rpc_pb.EnterpriseConfig
};

MeyCoinRPCService.GetConfChangeProgress = {
  methodName: "GetConfChangeProgress",
  service: MeyCoinRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.SingleBytes,
  responseType: raft_pb.ConfChangeProgress
};

exports.MeyCoinRPCService = MeyCoinRPCService;

function MeyCoinRPCServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

MeyCoinRPCServiceClient.prototype.nodeState = function nodeState(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MeyCoinRPCService.NodeState, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

MeyCoinRPCServiceClient.prototype.metric = function metric(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MeyCoinRPCService.Metric, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

MeyCoinRPCServiceClient.prototype.blockchain = function blockchain(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MeyCoinRPCService.Blockchain, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

MeyCoinRPCServiceClient.prototype.getChainInfo = function getChainInfo(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MeyCoinRPCService.GetChainInfo, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

MeyCoinRPCServiceClient.prototype.chainStat = function chainStat(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MeyCoinRPCService.ChainStat, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

MeyCoinRPCServiceClient.prototype.listBlockHeaders = function listBlockHeaders(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MeyCoinRPCService.ListBlockHeaders, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

MeyCoinRPCServiceClient.prototype.listBlockMetadata = function listBlockMetadata(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MeyCoinRPCService.ListBlockMetadata, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

MeyCoinRPCServiceClient.prototype.listBlockStream = function listBlockStream(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(MeyCoinRPCService.ListBlockStream, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onMessage: function (responseMessage) {
      listeners.data.forEach(function (handler) {
        handler(responseMessage);
      });
    },
    onEnd: function (status, statusMessage, trailers) {
      listeners.status.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners.end.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners = null;
    }
  });
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

MeyCoinRPCServiceClient.prototype.listBlockMetadataStream = function listBlockMetadataStream(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(MeyCoinRPCService.ListBlockMetadataStream, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onMessage: function (responseMessage) {
      listeners.data.forEach(function (handler) {
        handler(responseMessage);
      });
    },
    onEnd: function (status, statusMessage, trailers) {
      listeners.status.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners.end.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners = null;
    }
  });
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

MeyCoinRPCServiceClient.prototype.getBlock = function getBlock(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MeyCoinRPCService.GetBlock, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

MeyCoinRPCServiceClient.prototype.getBlockMetadata = function getBlockMetadata(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MeyCoinRPCService.GetBlockMetadata, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

MeyCoinRPCServiceClient.prototype.getBlockBody = function getBlockBody(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MeyCoinRPCService.GetBlockBody, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

MeyCoinRPCServiceClient.prototype.getTX = function getTX(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MeyCoinRPCService.GetTX, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

MeyCoinRPCServiceClient.prototype.getBlockTX = function getBlockTX(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MeyCoinRPCService.GetBlockTX, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

MeyCoinRPCServiceClient.prototype.getReceipt = function getReceipt(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MeyCoinRPCService.GetReceipt, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

MeyCoinRPCServiceClient.prototype.getABI = function getABI(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MeyCoinRPCService.GetABI, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

MeyCoinRPCServiceClient.prototype.sendTX = function sendTX(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MeyCoinRPCService.SendTX, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

MeyCoinRPCServiceClient.prototype.signTX = function signTX(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MeyCoinRPCService.SignTX, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

MeyCoinRPCServiceClient.prototype.verifyTX = function verifyTX(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MeyCoinRPCService.VerifyTX, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

MeyCoinRPCServiceClient.prototype.commitTX = function commitTX(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MeyCoinRPCService.CommitTX, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

MeyCoinRPCServiceClient.prototype.getState = function getState(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MeyCoinRPCService.GetState, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

MeyCoinRPCServiceClient.prototype.getStateAndProof = function getStateAndProof(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MeyCoinRPCService.GetStateAndProof, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

MeyCoinRPCServiceClient.prototype.createAccount = function createAccount(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MeyCoinRPCService.CreateAccount, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

MeyCoinRPCServiceClient.prototype.getAccounts = function getAccounts(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MeyCoinRPCService.GetAccounts, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

MeyCoinRPCServiceClient.prototype.lockAccount = function lockAccount(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MeyCoinRPCService.LockAccount, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

MeyCoinRPCServiceClient.prototype.unlockAccount = function unlockAccount(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MeyCoinRPCService.UnlockAccount, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

MeyCoinRPCServiceClient.prototype.importAccount = function importAccount(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MeyCoinRPCService.ImportAccount, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

MeyCoinRPCServiceClient.prototype.exportAccount = function exportAccount(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MeyCoinRPCService.ExportAccount, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

MeyCoinRPCServiceClient.prototype.queryContract = function queryContract(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MeyCoinRPCService.QueryContract, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

MeyCoinRPCServiceClient.prototype.queryContractState = function queryContractState(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MeyCoinRPCService.QueryContractState, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

MeyCoinRPCServiceClient.prototype.getPeers = function getPeers(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MeyCoinRPCService.GetPeers, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

MeyCoinRPCServiceClient.prototype.getVotes = function getVotes(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MeyCoinRPCService.GetVotes, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

MeyCoinRPCServiceClient.prototype.getAccountVotes = function getAccountVotes(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MeyCoinRPCService.GetAccountVotes, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

MeyCoinRPCServiceClient.prototype.getStaking = function getStaking(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MeyCoinRPCService.GetStaking, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

MeyCoinRPCServiceClient.prototype.getNameInfo = function getNameInfo(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MeyCoinRPCService.GetNameInfo, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

MeyCoinRPCServiceClient.prototype.listEventStream = function listEventStream(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(MeyCoinRPCService.ListEventStream, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onMessage: function (responseMessage) {
      listeners.data.forEach(function (handler) {
        handler(responseMessage);
      });
    },
    onEnd: function (status, statusMessage, trailers) {
      listeners.status.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners.end.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners = null;
    }
  });
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

MeyCoinRPCServiceClient.prototype.listEvents = function listEvents(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MeyCoinRPCService.ListEvents, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

MeyCoinRPCServiceClient.prototype.getServerInfo = function getServerInfo(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MeyCoinRPCService.GetServerInfo, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

MeyCoinRPCServiceClient.prototype.getConsensusInfo = function getConsensusInfo(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MeyCoinRPCService.GetConsensusInfo, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

MeyCoinRPCServiceClient.prototype.changeMembership = function changeMembership(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MeyCoinRPCService.ChangeMembership, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

MeyCoinRPCServiceClient.prototype.getEnterpriseConfig = function getEnterpriseConfig(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MeyCoinRPCService.GetEnterpriseConfig, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

MeyCoinRPCServiceClient.prototype.getConfChangeProgress = function getConfChangeProgress(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MeyCoinRPCService.GetConfChangeProgress, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

exports.MeyCoinRPCServiceClient = MeyCoinRPCServiceClient;

