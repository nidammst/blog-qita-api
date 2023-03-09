const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const salt = bcrypt.genSaltSync(10)
const nodemailer = require('nodemailer')
const axios = require('axios')
var geoip = require('geoip-lite');

const register = async (req, res) => {
	const { firstName, name, email, password } = req.body;
	if(!firstName || !name || !email || !password) {
		return res.status(400).json({ message: "please fill all fields!", success: false })
	}
	
	let existingUser;
	let newUser;
	let token;
	try {
		existingUser = await User.findOne({ email: email })
		if(existingUser?.isVerified) {
			return res.status(400).json({ message: `${email} already exist...\n Login instead` })
		} else if(!existingUser) {
			const hashedPassword = bcrypt.hashSync(password, salt)
			let newUser = await User.create({
				firstName,
				name,
				email,
				password: hashedPassword
			});
			token = jwt.sign({ email: newUser.email, id: newUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' })
			await newUser.updateOne({ $set: {verificationToken: token} })
		} else if(existingUser) {
			token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' })
			await existingUser.updateOne({ $set: {verificationToken: token} })
		}

		const link = `http://localhost:3000/verify?token=${token}`
		try {
			const transporter = nodemailer.createTransport({
				port: 465,
				host: 'smtp.gmail.com',
				auth: {
					user: process.env.MAIL_USERNAME,
					pass: process.env.MAIL_PASSWORD
				},
				secure: true
			});

			const date = new Date(7 * 24 * 60 * 60 * 1000) // 7 days after today

			const mailOptions = {
				from: process.env.MAIL_USERNAME,
				to: email,
				subject: 'Verify Email',
				html: `<!doctype html><html ⚡4email data-css-strict><head><meta charset="utf-8"><style amp4email-boilerplate>body{visibility:hidden}</style><script async src="https://cdn.ampproject.org/v0.js"></script><style amp-custom>.es-desk-hidden {	display:none;	float:left;	overflow:hidden;	width:0;	max-height:0;	line-height:0;}body {	width:100%;	font-family:Imprima, Arial, sans-serif;}table {	border-collapse:collapse;	border-spacing:0px;}table td, body, .es-wrapper {	padding:0;	Margin:0;}.es-content, .es-header, .es-footer {	table-layout:fixed;	width:100%;}p, hr {	Margin:0;}h1, h2, h3, h4, h5 {	Margin:0;	line-height:120%;	font-family:Imprima, Arial, sans-serif;}.es-left {	float:left;}.es-right {	float:right;}.es-p5 {	padding:5px;}.es-p5t {	padding-top:5px;}.es-p5b {	padding-bottom:5px;}.es-p5l {	padding-left:5px;}.es-p5r {	padding-right:5px;}.es-p10 {	padding:10px;}.es-p10t {	padding-top:10px;}.es-p10b {	padding-bottom:10px;}.es-p10l {	padding-left:10px;}.es-p10r {	padding-right:10px;}.es-p15 {	padding:15px;}.es-p15t {	padding-top:15px;}.es-p15b {	padding-bottom:15px;}.es-p15l {	padding-left:15px;}.es-p15r {	padding-right:15px;}.es-p20 {	padding:20px;}.es-p20t {	padding-top:20px;}.es-p20b {	padding-bottom:20px;}.es-p20l {	padding-left:20px;}.es-p20r {	padding-right:20px;}.es-p25 {	padding:25px;}.es-p25t {	padding-top:25px;}.es-p25b {	padding-bottom:25px;}.es-p25l {	padding-left:25px;}.es-p25r {	padding-right:25px;}.es-p30 {	padding:30px;}.es-p30t {	padding-top:30px;}.es-p30b {	padding-bottom:30px;}.es-p30l {	padding-left:30px;}.es-p30r {	padding-right:30px;}.es-p35 {	padding:35px;}.es-p35t {	padding-top:35px;}.es-p35b {	padding-bottom:35px;}.es-p35l {	padding-left:35px;}.es-p35r {	padding-right:35px;}.es-p40 {	padding:40px;}.es-p40t {	padding-top:40px;}.es-p40b {	padding-bottom:40px;}.es-p40l {	padding-left:40px;}.es-p40r {	padding-right:40px;}.es-menu td {	border:0;}s {	text-decoration:line-through;}p, ul li, ol li {	font-family:Imprima, Arial, sans-serif;	line-height:150%;}ul li, ol li {	Margin-bottom:15px;	margin-left:0;}a {	text-decoration:underline;}.es-menu td a {	text-decoration:none;	display:block;	font-family:Imprima, Arial, sans-serif;}.es-menu amp-img, .es-button amp-img {	vertical-align:middle;}.es-wrapper {	width:100%;	height:100%;}.es-wrapper-color, .es-wrapper {	background-color:#FFFFFF;}.es-header {	background-color:transparent;}.es-header-body {	background-color:#EFEFEF;}.es-header-body p, .es-header-body ul li, .es-header-body ol li {	color:#2D3142;	font-size:14px;}.es-header-body a {	color:#2D3142;	font-size:14px;}.es-content-body {	background-color:#EFEFEF;}.es-content-body p, .es-content-body ul li, .es-content-body ol li {	color:#2D3142;	font-size:18px;}.es-content-body a {	color:#2D3142;	font-size:18px;}.es-footer {	background-color:transparent;}.es-footer-body {	background-color:#FFFFFF;}.es-footer-body p, .es-footer-body ul li, .es-footer-body ol li {	color:#2D3142;	font-size:14px;}.es-footer-body a {	color:#2D3142;	font-size:14px;}.es-infoblock, .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li {	line-height:120%;	font-size:12px;	color:#CCCCCC;}.es-infoblock a {	font-size:12px;	color:#CCCCCC;}h1 {	font-size:48px;	font-style:normal;	font-weight:bold;	color:#2D3142;}h2 {	font-size:36px;	font-style:normal;	font-weight:bold;	color:#2D3142;}h3 {	font-size:28px;	font-style:normal;	font-weight:bold;	color:#2D3142;}.es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a {	font-size:48px;}.es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a {	font-size:36px;}.es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a {	font-size:28px;}a.es-button, button.es-button {	display:inline-block;	background:#4114F7;	border-radius:30px;	font-size:22px;	font-family:Imprima, Arial, sans-serif;	font-weight:bold;	font-style:normal;	line-height:120%;	color:#FFFFFF;	text-decoration:none;	width:auto;	text-align:center;	padding:15px 20px 15px 20px;}.es-button-border {	border-style:solid solid solid solid;	border-color:#2CB543 #2CB543 #2CB543 #2CB543;	background:#4114F7;	border-width:0px 0px 0px 0px;	display:inline-block;	border-radius:30px;	width:auto;}body {	font-family:arial, "helvetica neue", helvetica, sans-serif;}.es-p-default {	padding-top:20px;	padding-right:40px;	padding-bottom:0px;	padding-left:40px;}.es-p-all-default {	padding:0px;}@media only screen and (max-width:600px) {p, ul li, ol li, a { line-height:150% } h1, h2, h3, h1 a, h2 a, h3 a { line-height:120% } h1 { font-size:30px; text-align:left } h2 { font-size:24px; text-align:left } h3 { font-size:20px; text-align:left } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:30px; text-align:left } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:24px; text-align:left } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px; text-align:left } .es-menu td a { font-size:14px } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:14px } .es-content-body p, .es-content-body ul li, .es-content-body ol li, .es-content-body a { font-size:14px } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:14px } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px } *[class="gmail-fix"] { display:none } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left } .es-m-txt-r amp-img { float:right } .es-m-txt-c amp-img { margin:0 auto } .es-m-txt-l amp-img { float:left } .es-button-border { display:block } a.es-button, button.es-button { font-size:18px; display:block; border-right-width:0px; border-left-width:0px; border-top-width:15px; border-bottom-width:15px } .es-adaptive table, .es-left, .es-right { width:100% } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%; max-width:600px } .es-adapt-td { display:block; width:100% } .adapt-img { width:100%; height:auto } td.es-m-p0 { padding:0px } td.es-m-p0r { padding-right:0px } td.es-m-p0l { padding-left:0px } td.es-m-p0t { padding-top:0px } td.es-m-p0b { padding-bottom:0 } td.es-m-p20b { padding-bottom:20px } .es-mobile-hidden, .es-hidden { display:none } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { width:auto; overflow:visible; float:none; max-height:inherit; line-height:inherit } tr.es-desk-hidden { display:table-row } table.es-desk-hidden { display:table } td.es-desk-menu-hidden { display:table-cell } .es-menu td { width:1% } table.es-table-not-adapt, .esd-block-html table { width:auto } table.es-social { display:inline-block } table.es-social td { display:inline-block } .es-desk-hidden { display:table-row; width:auto; overflow:visible; max-height:inherit } .h-auto { height:auto } }</style></head>
					<body><div class="es-wrapper-color"> <!--[if gte mso 9]><v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t"> <v:fill type="tile" color="#ffffff"></v:fill> </v:background><![endif]--><table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0"><tr><td valign="top"><table class="es-footer" cellspacing="0" cellpadding="0" align="center"><tr><td align="center"><table class="es-footer-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#bcb8b1" align="center"><tr><td class="es-p5t es-p5b es-p10r es-p10l" style="background-color: #999999;border-radius: 15px" bgcolor="#999999" align="left"><table width="100%" cellspacing="0" cellpadding="0"><tr><td width="580" valign="top" align="center"><table width="100%" cellspacing="0" cellpadding="0" role="presentation"><tr><td align="center"><h1 style="font-family: roboto, 'helvetica neue', helvetica, arial, sans-serif;font-size: 40px;color: #ffffff;line-height: 40px"><strong>BlogQita</strong></h1>
					</td></tr></table></td></tr></table></td></tr></table></td></tr></table><table class="es-content" cellspacing="0" cellpadding="0" align="center"><tr><td align="center"><table class="es-content-body" style="border-radius: 20px 20px 0 0 " width="600" cellspacing="0" cellpadding="0" bgcolor="#efefef" align="center"><tr><td class="es-p40t es-p40r es-p40l" align="left"><table width="100%" cellspacing="0" cellpadding="0"><tr><td width="520" valign="top" align="center"><table width="100%" cellspacing="0" cellpadding="0" role="presentation"><tr><td class="es-m-txt-c" style="font-size: 0px" align="left"><a target="_blank" href="https://viewstripo.email"><amp-img src="https://dhpfsb.stripocdn.email/content/guids/CABINET_ee77850a5a9f3068d9355050e69c76d26d58c3ea2927fa145f0d7a894e624758/images/group_4076323.png" alt="Confirm email" style="display: block;border-radius: 100px" title="Confirm email" width="100" height="100"></amp-img></a></td>
					</tr></table></td></tr></table></td></tr><tr><td class="es-p20t es-p40r es-p40l" align="left"><table width="100%" cellspacing="0" cellpadding="0"><tr><td width="520" valign="top" align="center"><table style="background-color: #fafafa;border-radius: 10px;border-collapse: separate" width="100%" cellspacing="0" cellpadding="0" bgcolor="#fafafa" role="presentation"><tr><td class="es-p20" align="left"><h3>Welcome,&nbsp;${newUser?.name || existingUser?.name}<br></h3><p><br></p><p>You're receiving this message because you recently signed up for a account.<br><br>Confirm your email address by clicking the button below. This step adds extra security to your business by verifying you own this email.</p></td></tr></table></td></tr></table></td></tr></table></td>
					</tr></table><table class="es-content" cellspacing="0" cellpadding="0" align="center"><tr><td align="center"><table class="es-content-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#efefef" align="center"><tr><td class="es-p30t es-p40b es-p40r es-p40l" align="left"><table width="100%" cellspacing="0" cellpadding="0"><tr><td width="520" valign="top" align="center"><table width="100%" cellspacing="0" cellpadding="0" role="presentation"><tr><td align="center"><span class="msohide es-button-border" style="display: block;background: #999999"><a href="${link}" class="es-button msohide" target="_blank" style="padding-left: 5px;padding-right: 5px;display: block;background: #999999;border-color: #999999">Confirm email</a></span> <!--<![endif]--></td>
					</tr></table></td></tr></table></td></tr><tr><td class="es-p40r es-p40l" align="left"><table width="100%" cellspacing="0" cellpadding="0"><tr><td width="520" valign="top" align="center"><table width="100%" cellspacing="0" cellpadding="0" role="presentation"><tr><td align="left"><p>Thanks,<br><br>Ahmad Nidzam Musthafa<br></p></td></tr><tr><td class="es-p40t es-p20b" style="font-size:0" align="center"><table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation"><tr><td style="border-bottom: 1px solid #666666;background: unset;height: 1px;width: 100%;margin: 0px"></td></tr></table></td></tr></table></td></tr></table></td></tr></table></td>
					</tr></table><table class="es-content" cellspacing="0" cellpadding="0" align="center"><tr><td align="center"><table class="es-content-body" style="border-radius: 0 0 20px 20px" width="600" cellspacing="0" cellpadding="0" bgcolor="#efefef" align="center"><tr><td class="es-p20t es-p20b es-p40r es-p40l esdev-adapt-off" align="left"><table class="esdev-mso-table" width="520" cellspacing="0" cellpadding="0"><tr><td class="esdev-mso-td" valign="top"><table class="es-left" cellspacing="0" cellpadding="0" align="left"><tr><td width="47" valign="top" align="center"><table width="100%" cellspacing="0" cellpadding="0" role="presentation"><tr><td class="es-m-txt-l" style="font-size: 0px" align="center"><a target="_blank" href="https://viewstripo.email"><amp-img src="https://dhpfsb.stripocdn.email/content/guids/CABINET_ee77850a5a9f3068d9355050e69c76d26d58c3ea2927fa145f0d7a894e624758/images/group_4076325.png" alt="Demo" style="display: block" title="Demo" width="47" height="47"></amp-img></a></td>
					</tr></table></td></tr></table></td><td width="20"></td><td class="esdev-mso-td" valign="top"><table class="es-right" cellspacing="0" cellpadding="0" align="right"><tr><td width="453" valign="top" align="center"><table width="100%" cellspacing="0" cellpadding="0" role="presentation"><tr><td align="left"><p style="font-size: 16px">This verification token is only valid until ${date}. If you have questions, <a target="_blank" style="font-size: 16px" href="https://instagram.com/nidzam.mst">we're here to help</a></p></td></tr></table></td></tr></table></td></tr></table></td></tr></table></td>
					</tr></table><table class="es-footer" cellspacing="0" cellpadding="0" align="center"><tr><td align="center"><table class="es-footer-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#bcb8b1" align="center"><tr><td class="es-p40t es-p30b es-p20r es-p20l" align="left"><table width="100%" cellspacing="0" cellpadding="0"><tr><td width="560" align="left"><table width="100%" cellspacing="0" cellpadding="0" role="presentation"><tr><td class="es-m-txt-c es-p10t es-p20b" style="font-size:0" align="center"><table class="es-table-not-adapt es-social" cellspacing="0" cellpadding="0" role="presentation"><tr><td class="es-p5r" valign="top" align="center"><a target="_blank" href="https://twitter.com/nidzammst"><amp-img src="https://dhpfsb.stripocdn.email/content/assets/img/social-icons/logo-black/twitter-logo-black.png" alt="Tw" title="Twitter" height="24" width="24"></amp-img></a></td>
					<td class="es-p5r" valign="top" align="center"><a target="_blank" href="https://web.facebook.com/ini.bukan.IDnya"><amp-img src="https://dhpfsb.stripocdn.email/content/assets/img/social-icons/logo-black/facebook-logo-black.png" alt="Fb" title="Facebook" height="24" width="24"></amp-img></a></td><td valign="top" align="center"><a target="_blank" href="https://www.linkedin.com/in/ahmad-nidzam-musthafa-45458b200/"><amp-img src="https://dhpfsb.stripocdn.email/content/assets/img/social-icons/logo-black/linkedin-logo-black.png" alt="In" title="Linkedin" height="24" width="24"></amp-img></a></td></tr></table></td></tr><tr><td align="center"><p style="font-size: 13px"><a target="_blank" style="text-decoration: none"></a><a target="_blank" style="text-decoration: none">Privacy Policy</a><a target="_blank" style="font-size: 13px;text-decoration: none"></a> • <a target="_blank" style="text-decoration: none">Unsubscribe</a></p></td>
					</tr><tr><td class="es-p20t" align="center"><p>Copyright © 2023 BlogQita<br></p></td></tr></table></td></tr></table></td></tr></table></td></tr></table><table class="es-footer" cellspacing="0" cellpadding="0" align="center"><tr><td align="center"><table class="es-footer-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center"><tr><td class="es-p20" align="left"><table width="100%" cellspacing="0" cellpadding="0"><tr><td width="560" align="left"><table width="100%" cellspacing="0" cellpadding="0"><tr><td style="display: none" align="center"></td></tr></table></td></tr></table></td></tr></table></td></tr></table></td></tr></table></div></body></html>
					`
			};

			transporter.sendMail(mailOptions, function(error, info){
			  if (error) {
			    console.log(error);
			  } else {
			    console.log('Email sent: ' + info.response);
			  }
			});
		} catch(err) {
			console.log(err)
		}
		res.status(201).json({ message: {existingUser} ? "Email verification has been sended to your email" : "Successfully register" })
	} catch (err) {
		console.log(err)
		res.status(400).json({ message: err })
	}
}

const verifyEmail = async (req, res, next) => {
	const { token } = req.query
	if(!token || token === 'null') {
		return res.status(400).json({ message: "Error no token found" })
	}
	jwt.verify(token, process.env.JWT_SECRET_KEY, {}, async (err, info) => {
		const user = await User.findByIdAndUpdate(info.id, { $set: { isVerified: true, image: 'uploads/default-user.png' } })
		if(!user) {
			return res.status(400).json({ message: "User not found please register again" })
		}
		return res.status(200).json({ message: "Successfully Verify Email", id: user._id, firstName: user.firstName, name: user.name, email: user.email, isVerified: user.isVerified })
	})
}

const requestResetPassword = async (req, res, next) => {
	const { email } = req.query
	const axiosData = await axios("https://api.infoip.io/ip")
	const ipAddress = axiosData.data
	const geo = await geoip.lookup(ipAddress)
	if(!email) {
		return res.status(400).json({ message: "Error email field don't be null" })
	}
	const user = await User.findOne({ email: email })
	if(!user) {
		return res.status(400).json({ message: `Account with email ${email} not found, please register first!`})
	}
	const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' })
	const link = `http://${req.hostname}:3000/reset-form?token=${token}`
	
	try {
		const transporter = nodemailer.createTransport({
			port: 465,
			host: 'smtp.gmail.com',
			auth: {
				user: process.env.MAIL_USERNAME,
				pass: process.env.MAIL_PASSWORD
			},
			secure: true
		});

		const date = new Date(24 * 60 * 60 * 1000) // one day after today

		const mailOptions = {
			from: process.env.MAIL_USERNAME,
			to: email,
			subject: 'Password reset',
			html: `<!doctype html><html ⚡4email data-css-strict><head><meta charset="utf-8"><style amp4email-boilerplate>body{visibility:hidden}</style><script async src="https://cdn.ampproject.org/v0.js"></script><style amp-custom>.es-desk-hidden { display:none; float:left; overflow:hidden; width:0; max-height:0; line-height:0;}body { width:100%; font-family:arial, "helvetica neue", helvetica, sans-serif;}table { border-collapse:collapse; border-spacing:0px;}table td, body, .es-wrapper { padding:0; Margin:0;}.es-content, .es-header, .es-footer { table-layout:fixed; width:100%;}p, hr { Margin:0;}h1, h2, h3, h4, h5 { Margin:0; line-height:120%; font-family:arial, "helvetica neue", helvetica, sans-serif;}.es-left { float:left;}.es-right { float:right;}.es-p5 { padding:5px;}.es-p5t { padding-top:5px;}.es-p5b { padding-bottom:5px;}.es-p5l { padding-left:5px;}.es-p5r { padding-right:5px;}.es-p10 { padding:10px;}.es-p10t { padding-top:10px;}.es-p10b { padding-bottom:10px;}.es-p10l { padding-left:10px;}.es-p10r { padding-right:10px;}.es-p15 { padding:15px;}.es-p15t { padding-top:15px;}.es-p15b { padding-bottom:15px;}.es-p15l { padding-left:15px;}.es-p15r { padding-right:15px;}.es-p20 { padding:20px;}.es-p20t { padding-top:20px;}.es-p20b { padding-bottom:20px;}.es-p20l { padding-left:20px;}.es-p20r { padding-right:20px;}.es-p25 { padding:25px;}.es-p25t { padding-top:25px;}.es-p25b { padding-bottom:25px;}.es-p25l { padding-left:25px;}.es-p25r { padding-right:25px;}.es-p30 { padding:30px;}.es-p30t { padding-top:30px;}.es-p30b { padding-bottom:30px;}.es-p30l { padding-left:30px;}.es-p30r { padding-right:30px;}.es-p35 { padding:35px;}.es-p35t { padding-top:35px;}.es-p35b { padding-bottom:35px;}.es-p35l { padding-left:35px;}.es-p35r { padding-right:35px;}.es-p40 { padding:40px;}.es-p40t { padding-top:40px;}.es-p40b { padding-bottom:40px;}.es-p40l { padding-left:40px;}.es-p40r { padding-right:40px;}.es-menu td { border:0;}s { text-decoration:line-through;}p, ul li, ol li { font-family:arial, "helvetica neue", helvetica, sans-serif; line-height:150%;}ul li, ol li { Margin-bottom:15px; margin-left:0;}a { text-decoration:underline;}.es-menu td a { text-decoration:none; display:block; font-family:arial, "helvetica neue", helvetica, sans-serif;}.es-menu amp-img, .es-button amp-img { vertical-align:middle;}.es-wrapper { width:100%; height:100%;}.es-wrapper-color, .es-wrapper { background-color:#FAFAFA;}.es-header { background-color:transparent;}.es-header-body { background-color:transparent;}.es-header-body p, .es-header-body ul li, .es-header-body ol li { color:#333333; font-size:14px;}.es-header-body a { color:#666666; font-size:14px;}.es-content-body { background-color:#FFFFFF;}.es-content-body p, .es-content-body ul li, .es-content-body ol li { color:#333333; font-size:14px;}.es-content-body a { color:#5C68E2; font-size:14px;}.es-footer { background-color:transparent;}.es-footer-body { background-color:#FFFFFF;}.es-footer-body p, .es-footer-body ul li, .es-footer-body ol li { color:#333333; font-size:12px;}.es-footer-body a { color:#333333; font-size:12px;}.es-infoblock, .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li { line-height:120%; font-size:12px; color:#CCCCCC;}.es-infoblock a { font-size:12px; color:#CCCCCC;}h1 { font-size:46px; font-style:normal; font-weight:bold; color:#333333;}h2 { font-size:26px; font-style:normal; font-weight:bold; color:#333333;}h3 { font-size:20px; font-style:normal; font-weight:bold; color:#333333;}.es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:46px;}.es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:26px;}.es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px;}a.es-button, button.es-button { display:inline-block; background:#5C68E2; border-radius:5px; font-size:20px; font-family:arial, "helvetica neue", helvetica, sans-serif; font-weight:normal; font-style:normal; line-height:120%; color:#FFFFFF; text-decoration:none; width:auto; text-align:center; padding:10px 30px 10px 30px;}.es-button-border { border-style:solid solid solid solid; border-color:#2CB543 #2CB543 #2CB543 #2CB543; background:#5C68E2; border-width:0px 0px 0px 0px; display:inline-block; border-radius:5px; width:auto;}body { font-family:arial, "helvetica neue", helvetica, sans-serif;}@media only screen and (max-width:600px) {p, ul li, ol li, a { line-height:150% } h1, h2, h3, h1 a, h2 a, h3 a { line-height:120% } h1 { font-size:36px; text-align:left } h2 { font-size:26px; text-align:left } h3 { font-size:20px; text-align:left } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:36px; text-align:left } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:26px; text-align:left } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px; text-align:left } .es-menu td a { font-size:12px } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:14px } .es-content-body p, .es-content-body ul li, .es-content-body ol li, .es-content-body a { font-size:14px } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:14px } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px } *[class="gmail-fix"] { display:none } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left } .es-m-txt-r amp-img { float:right } .es-m-txt-c amp-img { margin:0 auto } .es-m-txt-l amp-img { float:left } .es-button-border { display:inline-block } a.es-button, button.es-button { font-size:20px; display:inline-block } .es-adaptive table, .es-left, .es-right { width:100% } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%; max-width:600px } .es-adapt-td { display:block; width:100% } .adapt-img { width:100%; height:auto } td.es-m-p0 { padding:0 } td.es-m-p0r { padding-right:0 } td.es-m-p0l { padding-left:0 } td.es-m-p0t { padding-top:0 } td.es-m-p0b { padding-bottom:0 } td.es-m-p20b { padding-bottom:20px } .es-mobile-hidden, .es-hidden { display:none } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { width:auto; overflow:visible; float:none; max-height:inherit; line-height:inherit } tr.es-desk-hidden { display:table-row } table.es-desk-hidden { display:table } td.es-desk-menu-hidden { display:table-cell } .es-menu td { width:1% } table.es-table-not-adapt, .esd-block-html table { width:auto } table.es-social { display:inline-block } table.es-social td { display:inline-block } td.es-m-p5 { padding:5px } td.es-m-p5t { padding-top:5px } td.es-m-p5b { padding-bottom:5px } td.es-m-p5r { padding-right:5px } td.es-m-p5l { padding-left:5px } td.es-m-p10 { padding:10px } td.es-m-p10t { padding-top:10px } td.es-m-p10b { padding-bottom:10px } td.es-m-p10r { padding-right:10px } td.es-m-p10l { padding-left:10px } td.es-m-p15 { padding:15px } td.es-m-p15t { padding-top:15px } td.es-m-p15b { padding-bottom:15px } td.es-m-p15r { padding-right:15px } td.es-m-p15l { padding-left:15px } td.es-m-p20 { padding:20px } td.es-m-p20t { padding-top:20px } td.es-m-p20r { padding-right:20px } td.es-m-p20l { padding-left:20px } td.es-m-p25 { padding:25px } td.es-m-p25t { padding-top:25px } td.es-m-p25b { padding-bottom:25px } td.es-m-p25r { padding-right:25px } td.es-m-p25l { padding-left:25px } td.es-m-p30 { padding:30px } td.es-m-p30t { padding-top:30px } td.es-m-p30b { padding-bottom:30px } td.es-m-p30r { padding-right:30px } td.es-m-p30l { padding-left:30px } td.es-m-p35 { padding:35px } td.es-m-p35t { padding-top:35px } td.es-m-p35b { padding-bottom:35px } td.es-m-p35r { padding-right:35px } td.es-m-p35l { padding-left:35px } td.es-m-p40 { padding:40px } td.es-m-p40t { padding-top:40px } td.es-m-p40b { padding-bottom:40px } td.es-m-p40r { padding-right:40px } td.es-m-p40l { padding-left:40px } .es-desk-hidden { display:table-row; width:auto; overflow:visible; max-height:inherit } }</style></head>
				<body><div class="es-wrapper-color"> <!--[if gte mso 9]><v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t"> <v:fill type="tile" color="#fafafa"></v:fill> </v:background><![endif]--><table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0"><tr><td valign="top"><table class="es-content" cellspacing="0" cellpadding="0" align="center"><tr><td class="es-info-area" align="center"><table class="es-content-body" style="background-color: transparent" width="600" cellspacing="0" cellpadding="0" bgcolor="rgba(0, 0, 0, 0)" align="center"><tr><td class="es-p20" align="left"><table width="100%" cellspacing="0" cellpadding="0"><tr><td width="560" valign="top" align="center"><table width="100%" cellspacing="0" cellpadding="0" role="presentation"><tr><td class="es-infoblock" align="center"><p><a target="_blank" href="https://localhost:3000">View Our Blogs</a></p></td></tr></table></td></tr></table></td></tr></table></td>
				</tr></table><table class="es-header" cellspacing="0" cellpadding="0" align="center"><tr><td align="center"><table class="es-header-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center"><tr><td style="border-radius: 10px" align="left"><table width="100%" cellspacing="0" cellpadding="0"><tr><td class="es-m-p0r" width="600" valign="top" align="center"><table style="border-color: transparent;border-style: solid;border-width: 2px;border-radius: 45px;border-collapse: separate" width="100%" cellspacing="0" cellpadding="0" role="presentation"><tr><td style="position: relative" align="center"><a target="_blank" href="http://localhost:3000"><amp-img class="adapt-img" src="https://dhpfsb.stripocdn.email/content/guids/bannerImgGuid/images/image16780601831004265.png" alt title width="596" height="89" layout="responsive"></amp-img></a></td></tr></table></td></tr></table></td></tr></table></td>
				</tr></table><table class="es-content" cellspacing="0" cellpadding="0" align="center"><tr><td align="center"><table class="es-content-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center"><tr><td class="es-p15t es-p20r es-p20l" align="left"><table width="100%" cellspacing="0" cellpadding="0"><tr><td width="560" valign="top" align="center"><table width="100%" cellspacing="0" cellpadding="0" role="presentation"><tr><td class="es-p10t es-p10b" style="font-size: 0px" align="center"><amp-img src="https://dhpfsb.stripocdn.email/content/guids/CABINET_91d375bbb7ce4a7f7b848a611a0368a7/images/69901618385469411.png" alt style="display: block" width="100" height="100"></amp-img></td></tr><tr><td class="es-p15t es-p15b es-p40r es-p40l es-m-p0r es-m-p0l es-m-txt-c" align="center"><h1>Password reset&nbsp;</h1></td>
				</tr><tr><td class="es-p10t" align="left"><p>After you click the button, you'll be asked to complete the following steps:</p><ol><li>Enter a new password.</li><li>Re-Enter a new password.</li><li>Confirm your new password.</li><li>Click Reset Password.</li></ol></td></tr><tr><td class="es-p10t" align="left"><p>As a friendly reminder, your account details are:</p><ul><li>Name : ${user?.name}<br></li><li>Email : ${user?.email}<br></li></ul></td></tr><tr><td class="es-p10t" align="left"><p>For security purposes, all of your sessions have been logged out. The details of the client who initiated this request are:s a friendly reminder, your account details are:</p><ul><li>IP : ${ipAddress}<br></li><li>IP information : ${JSON.stringify(geo)}<br></li><li>Location : https://www.google.com/maps/place/${geo.ll[0]},${geo.ll[1]}<br></li></ul></td></tr></table></td></tr></table></td>
				</tr><tr><td class="es-p20b es-p20r es-p20l" align="left"><table width="100%" cellspacing="0" cellpadding="0"><tr><td width="560" valign="top" align="center"><table style="border-radius: 5px;border-collapse: separate" width="100%" cellspacing="0" cellpadding="0" role="presentation"><tr><td class="es-p10t es-p10b" align="center"><span class="msohide es-button-border" style="border-radius: 6px"><a href="${link}" class="es-button" target="_blank" style="padding-left: 30px;padding-right: 30px;border-radius: 6px">RESET YOUR PASSWORD</a></span></td>
				</tr><tr><td class="es-p10t es-m-txt-c" align="center"><h3 style="line-height: 150%">This link is valid for one use only. Expires in 2 hours.</h3></td></tr><tr><td class="es-p10t es-p10b" align="center"><p style="line-height: 150%">If you didn't request to reset your&nbsp;password, please disregard this message or contact our customer service department.</p></td></tr></table></td></tr></table></td></tr></table></td>
				</tr></table><table class="es-footer" cellspacing="0" cellpadding="0" align="center"><tr><td align="center"><table class="es-footer-body" style="background-color: transparent" width="600" cellspacing="0" cellpadding="0" align="center"><tr><td class="es-p20t es-p20b es-p20r es-p20l" align="left"><table width="100%" cellspacing="0" cellpadding="0"><tr><td width="560" align="left"><table width="100%" cellspacing="0" cellpadding="0" role="presentation"><tr><td class="es-p15t es-p15b" style="font-size:0" align="center"><table class="es-table-not-adapt es-social" cellspacing="0" cellpadding="0" role="presentation"><tr><td class="es-p40r" valign="top" align="center"><a target="_blank" href="https://web.facebook.com/ini.bukan.IDnya"><amp-img title="Facebook" src="https://dhpfsb.stripocdn.email/content/assets/img/social-icons/logo-black/facebook-logo-black.png" alt="Fb" width="32" height="32"></amp-img></a></td>
				<td class="es-p40r" valign="top" align="center"><a target="_blank" href="https://twitter.com/nidzammst"><amp-img title="Twitter" src="https://dhpfsb.stripocdn.email/content/assets/img/social-icons/logo-black/twitter-logo-black.png" alt="Tw" width="32" height="32"></amp-img></a></td><td class="es-p40r" valign="top" align="center"><a target="_blank" href="https://instagram.com/nidzammst"><amp-img title="Instagram" src="https://dhpfsb.stripocdn.email/content/assets/img/social-icons/logo-black/instagram-logo-black.png" alt="Inst" width="32" height="32"></amp-img></a></td><td valign="top" align="center"><a target="_blank" href="https://www.youtube.com/@nidzamm"><amp-img title="Youtube" src="https://dhpfsb.stripocdn.email/content/assets/img/social-icons/logo-black/youtube-logo-black.png" alt="Yt" width="32" height="32"></amp-img></a></td></tr></table></td>
				</tr><tr><td class="es-p35b" align="center"><p>BlogQita © 2021 BlogQita official. All Rights Reserved.</p><p>40215 Bandung Kulon, Kota Bandung, Jawa Barat, Indonesia</p></td></tr><tr><td><table class="es-menu" width="100%" cellspacing="0" cellpadding="0" role="presentation"><tr class="links"><td class="es-p10t es-p10b es-p5r es-p5l" style="padding-top: 5px;padding-bottom: 5px" width="33.33%" valign="top" align="center"><a target="_blank" href="https://">Visit Us </a></td><td class="es-p10t es-p10b es-p5r es-p5l" style="padding-top: 5px;padding-bottom: 5px;border-left: 1px solid #cccccc" width="33.33%" valign="top" align="center"><a target="_blank" href="https://">Privacy Policy</a></td><td class="es-p10t es-p10b es-p5r es-p5l" style="padding-top: 5px;padding-bottom: 5px;border-left: 1px solid #cccccc" width="33.33%" valign="top" align="center"><a target="_blank" href="https://localhost:3000">Terms of Use</a></td></tr></table></td>
				</tr></table></td></tr></table></td></tr></table></td></tr></table><table class="es-content" cellspacing="0" cellpadding="0" align="center"><tr><td class="es-info-area" align="center"><table class="es-content-body" style="background-color: transparent" width="600" cellspacing="0" cellpadding="0" bgcolor="rgba(0, 0, 0, 0)" align="center"><tr><td class="es-p20" align="left"><table width="100%" cellspacing="0" cellpadding="0"><tr><td width="560" valign="top" align="center"><table width="100%" cellspacing="0" cellpadding="0" role="presentation"><tr><td class="es-infoblock" align="center"><p><a target="_blank"></a>No longer want to receive these emails?&nbsp;<a href target="_blank">Unsubscribe</a>.<a target="_blank"></a></p></td></tr></table></td></tr></table></td></tr></table></td></tr></table></td></tr></table></div></body></html>
				`
		};

		transporter.sendMail(mailOptions, function(error, info){
		  if (error) {
		    console.log(error);
		  } else {
		    console.log('Email sent: ' + info.response);
		  }
		});
	} catch(err) {
		console.log(err)
	}
	res.status(200).json({ message: "reset password email has been sended, please check your email", link})
}

const resetPassword = async (req, res, next) => {
	const { token } = req.query
	const { password } = req.body

	if(!token) {
		return res.status(400).json({ message: "No token found" })
	}

	jwt.verify(token, process.env.JWT_SECRET_KEY, {}, async (err, info) => {
		const hashedPassword = bcrypt.hashSync(password, salt)
		const user = await User.findByIdAndUpdate(info.id, { $set: {password: hashedPassword} })
		if(!user) {
			return res.status(400).json({ message: "invalid Credentials"})
		}
		res.status(200).json({ message: "Successfully Change password" })
	})
}

const login = async (req, res) => {
	const { email, password } = req.body
	if(req.headers.cookie) {
		req.headers.cookie = ''
	}

	let existingUser;
	try{
		existingUser = await User.findOne({ email: email })
	} catch (err) {
		return new Error(err)
	}

	if(!existingUser) {
		return res.status(400).json({ message: "You are have not register. Please register first :)" })
	}
	if(!existingUser?.isVerified) {
		return res.status(400).json({ message: "You have not verified your account, please check your email to verify it!" })
	}

	const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password)
	if(!isPasswordCorrect) {
		return res.status(400).json({ message: `Wrong Password for Account ${existingUser?.name}` })
	}
	const token = jwt.sign({ email, id: existingUser._id }, process.env.JWT_SECRET_KEY, {
		expiresIn: "1d"
	})

	if (req.cookies[`${existingUser._id}`]) {
		req.cookies[`${existingUser._id}`] = "";
	}

	console.log("Generated Token\n", token)
	res.cookie(String(existingUser._id), token, {
		path: "/",
		expires: new Date(Date.now() + 600000 * 24), // 1 day
		httpOnly: true,
		sameSite: "lax",
	});

	return res.status(200).json({ message: "Successfully Logged In", firstName: existingUser.firstName, name: existingUser.name, email: existingUser.email, id: existingUser._id, token })
}

const verifyToken = async (req, res, next) => {
	const cookies = req.headers.cookie
	if(!cookies) {
		return res.status(404).json({ message: "No token found (cookies)" })
	}
	const token = cookies.split("=")[1]
	if(!token) {
		return res.status(404).json({ message: "No token found (token)" })
	}
	jwt.verify(String(token), process.env.JWT_SECRET_KEY, (err, user) => {
		if(err) {
			return res.status(400).json({ message: "Invalid token", token })
		}
		req.id = user.id
	})
	next()
}

const logout = async (req, res, next) => {
	const cookies = req.headers.cookie
	const prevToken = cookies.split("=")[1]
	if(!prevToken) {
		return res.status(400).json({ message: "Authentication failed.. try again"})
	}

	jwt.verify(String(prevToken), process.env.JWT_SECRET_KEY, (err, user) => {
		if(err) {
			console.log(err)
			return res.status(403).json({message: "Authentication failed"})
		}
		res.clearCookie(`${user.id}`)
		req.cookies[`${user.id}`] = ""

		return res.status(200).json({message: "Successfully Logged Out"})
	})
}

exports.register = register
exports.verifyEmail = verifyEmail
exports.login = login
exports.requestResetPassword = requestResetPassword
exports.resetPassword = resetPassword
exports.verifyToken = verifyToken
exports.logout = logout