deploy:
	rm -rf .next
	vercel --prod
	say "deployed"
