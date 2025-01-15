use cosmwasm_std::{
    entry_point, to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdError, StdResult,
};

use crate::{
    msg::{ExecuteMsg, InstantiateMsg, PasswordResponse, QueryMsg},
    state::{Password, PASSWORD},
};

#[entry_point]
pub fn instantiate(
    _deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    _msg: InstantiateMsg,
) -> StdResult<Response> {
    Ok(Response::default())
}

#[entry_point]
pub fn execute(
    deps: DepsMut,
    env: Env,
    _info: MessageInfo,
    msg: ExecuteMsg,
) -> StdResult<Response> {
    match msg {
        ExecuteMsg::StorePassword {
            password_key,
            password_value,
        } => try_store_password(deps, env, password_key, password_value),
    }
}

pub fn try_store_password(
    deps: DepsMut,
    _env: Env,
    password_key: String,
    password_value: String,
) -> StdResult<Response> {
    let password = Password {
        password: password_value.clone(),
    };
    PASSWORD.insert(deps.storage, &password_key, &password)?;
    deps.api.debug("password stored successfully");
    Ok(Response::default())
}

#[entry_point]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetPassword { password_key } => to_binary(&query_password(deps, password_key)?),
    }
}

fn query_password(deps: Deps, password_key: String) -> StdResult<PasswordResponse> {
    let password = PASSWORD
        .get(deps.storage, &password_key)
        .ok_or(StdError::generic_err("Password key is incorrect!"))?;
    Ok(PasswordResponse {
        password: password.password,
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    use cosmwasm_std::testing::*;
    use cosmwasm_std::{from_binary, Coin, Uint128};

    #[test]
    fn store_password() {
        let mut deps = mock_dependencies_with_balance(&[Coin {
            denom: "token".to_string(),
            amount: Uint128::new(2),
        }]);
        let info = mock_info(
            "creator",
            &[Coin {
                denom: "token".to_string(),
                amount: Uint128::new(2),
            }],
        );
        let init_msg = InstantiateMsg {};

        let _res = instantiate(deps.as_mut(), mock_env(), info, init_msg).unwrap();

        // anyone can increment
        let info = mock_info(
            "anyone",
            &[Coin {
                denom: "token".to_string(),
                amount: Uint128::new(2),
            }],
        );

        let exec_msg = ExecuteMsg::StorePassword {
            password_key: "test".to_string(),
            password_value: "password123".to_string(),
        };
        let _res = execute(deps.as_mut(), mock_env(), info, exec_msg).unwrap();

        // should increase counter by 1
        let res = query(
            deps.as_ref(),
            mock_env(),
            QueryMsg::GetPassword {
                password_key: "test".to_string(),
            },
        )
        .unwrap();
        let value: PasswordResponse = from_binary(&res).unwrap();

        // Print the result to the terminal
        println!("Queried Password: {}", value.password);

        assert_eq!("password123", value.password);
    }
}
