defmodule DemoWeb.RootLayout do
  @moduledoc """
  Shared helpers for the root layout.
  """

  import Plug.Conn
  import Inertia.Controller

  def assign_page_title(conn, title) do
    conn
    |> assign(:page_title, title)
    |> assign_prop(:page_title, title)
  end
end
