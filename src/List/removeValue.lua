local List = script.Parent

local Llama = List.Parent
local t = require(Llama.t)

local validate = t.table

local function removeValue(list, value)
	assert(validate(list))
	
	local new = {}
	local index = 1

	for i = 1, #list do
		if list[i] ~= value then
			new[index] = list[i]
			index = index + 1
		end
	end

	return new
end

return removeValue