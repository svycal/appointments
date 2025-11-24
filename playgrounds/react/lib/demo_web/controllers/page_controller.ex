defmodule DemoWeb.PageController do
  use DemoWeb, :controller

  def home(conn, _params) do
    conn
    |> assign_page_title("Home")
    |> render_inertia("Home")
  end
end
