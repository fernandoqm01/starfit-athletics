import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const response = NextResponse.next({ request })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    if (url.pathname.startsWith("/admin")) {
      url.pathname = "/login"
      return NextResponse.redirect(url)
    }
    return response
  }

  let user = null

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value)
          })
        },
      },
    })

    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch {
    user = null
  }

  if (url.pathname.startsWith("/admin") && !user) {
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  if (url.pathname === "/login" && user) {
    url.pathname = "/admin"
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
}
