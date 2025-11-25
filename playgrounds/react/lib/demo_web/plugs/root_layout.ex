defmodule DemoWeb.RootLayout do
  @moduledoc """
  Shared helpers for the root layout.
  """

  use Joken.Config

  import Plug.Conn
  import Inertia.Controller

  def assign_page_title(conn, title) do
    conn
    |> assign(:page_title, title)
    |> assign_prop(:page_title, title)
  end

  def assign_root_layout_props(conn) do
    conn
    |> assign_prop(:savvycal_token, generate_savvycal_token())
  end

  defp generate_savvycal_token do
    config = savvycal_config()
    kid = config[:kid]
    {_, jwk} = config[:signing_key] |> JOSE.JWK.from_pem() |> JOSE.JWK.to_map()
    signer = Joken.Signer.create("ES256", jwk, %{"kid" => kid})

    claims = %{
      "sub" => config[:subject],
      "iat" => DateTime.to_unix(DateTime.utc_now()),
      "exp" => DateTime.to_unix(DateTime.add(DateTime.utc_now(), 3600))
    }

    generate_and_sign!(claims, signer)
  end

  defp savvycal_config do
    Application.get_env(:demo, :savvycal)
  end
end
