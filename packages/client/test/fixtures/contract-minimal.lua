-- meyluac --abi contract-inc.abi.json contract-inc.lua contract-inc.out
-- meyluac --payload ./contract-inc.lua > contract-inc.txt

function a()
    return system.getCreator()
end

abi.register(a)